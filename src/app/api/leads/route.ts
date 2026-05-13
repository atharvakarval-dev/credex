import { NextResponse } from "next/server";
import { z } from "zod";
import { getDataSource } from "../../../lib/db";
import { LeadSchema } from "../../../entities/LeadSchema";
import { AuditSchema } from "../../../entities/AuditSchema";
import { Lead } from "../../../entities/Lead";
import { Audit } from "../../../entities/Audit";
import { generateId } from "../../../lib/utils";
import { leadRateLimit } from "../../../lib/rate-limit";
import { Resend } from "resend";

const leadSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional(),
  website: z.string().optional(), // Honeypot
});

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const leadRepo = dataSource.getRepository(LeadSchema);
    
    // In a real app, you'd add auth here. 
    // For this intelligence suite demo, we'll allow fetching.
    const leads = await leadRepo.find({
      order: { createdAt: "DESC" }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Fetch Leads Error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (leadRateLimit) {
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const { success } = await leadRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429 });
      }
    }

    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "validation_failed" }, { status: 400 });
    }
    const { auditId, email, companyName, website } = parsed.data;

    // Honeypot check
    if (website && website.trim() !== "") {
      // It's a bot. Fail silently to confuse them.
      console.warn("Honeypot triggered for email:", email);
      return NextResponse.json({ success: true });
    }

    const dataSource = await getDataSource();
    const auditRepo = dataSource.getRepository(AuditSchema);
    const leadRepo = dataSource.getRepository(LeadSchema);

    const auditRecord = await auditRepo.findOne({ where: { id: auditId } });
    if (!auditRecord) {
      return NextResponse.json({ error: "audit_not_found" }, { status: 404 });
    }

    // Check if lead already exists for this audit
    const existingLead = await leadRepo.findOne({ where: { auditId } });
    if (existingLead) {
      return NextResponse.json({ error: "lead_already_captured" }, { status: 409 });
    }

    const newLead = new Lead();
    newLead.id = generateId();
    newLead.auditId = auditId;
    newLead.email = email;
    if (companyName) newLead.companyName = companyName;

    await leadRepo.save(newLead);

    // Trigger transactional email (Graceful failure)
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_...") {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Credex Audit <audit@credex.com>",
          to: email,
          subject: "Your AI Spend Audit Playbook 🚀",
          html: `<p>Hi there,</p><p>Thanks for running your AI spend audit. You can view your full implementation details here: <a href="https://credex.rocks/results/${auditId}">Your Playbook</a></p><p>Best,<br/>The Credex Team</p>`,
        });
      } else {
        console.log(`[MOCK EMAIL] Sent to ${email} for audit ${auditId}`);
      }
    } catch (emailError) {
      console.error("Email Dispatch Error (Non-blocking):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead Capture Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ 
      error: "internal_error", 
      message: message.includes("DATABASE_CONNECTION_ERROR") ? "Database unavailable. Please check your credentials." : message 
    }, { status: 500 });
  }
}
