import { summaryRateLimit } from "../../../lib/rate-limit";
import { getDataSource } from "../../../lib/db";
import { AuditSchema } from "../../../entities/AuditSchema";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { AuditResult } from "../../../types/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auditId } = body;
    console.log("[AI SUMMARY] Request for auditId:", auditId);

    if (!auditId) {
      console.warn("[AI SUMMARY] Missing auditId in request body");
      return new Response("Missing auditId", { status: 400 });
    }

    // 1. Rate Limiting
    if (summaryRateLimit) {
      const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
      const { success } = await summaryRateLimit.limit(ip);
      if (!success) {
        console.warn("[AI SUMMARY] Rate limit exceeded for IP:", ip);
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }

    // 2. Fetch Audit Data
    const dataSource = await getDataSource();
    const auditRepo = dataSource.getRepository(AuditSchema);

    const auditRecord = await auditRepo.findOne({
      where: { id: auditId },
    });

    if (!auditRecord) {
      console.error("[AI SUMMARY] Audit not found for ID:", auditId);
      return new Response("Audit not found", { status: 404 });
    }

    const result = auditRecord.resultSnapshot as unknown as AuditResult;
    if (!result || !result.recommendations) {
      console.error("[AI SUMMARY] Audit result snapshot is malformed for ID:", auditId);
      return new Response("Audit data malformed", { status: 500 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    const prompt = `Write a short 2-paragraph executive summary for this AI spend audit: $${result.totalAnnualSavings} in potential annual savings. Use these details: ${JSON.stringify(result.recommendations)}. Be direct and professional. Focus on high-impact savings first.`;

    // Standardizing on the Groq configuration with the requested stable model
    const groqProxy = createOpenAI({
      apiKey: apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    console.log("[AI SUMMARY] Starting stream with model: openai/gpt-oss-20b (via Groq)");
    const res = await streamText({
      model: groqProxy("openai/gpt-oss-20b"),
      prompt,
    });

    console.log("[AI SUMMARY] Stream initialized successfully");
    return res.toTextStreamResponse();
  } catch (error) {
    console.error("[AI SUMMARY ERROR]:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(
      JSON.stringify({ error: "AI Generation Failed", details: errorMessage }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
