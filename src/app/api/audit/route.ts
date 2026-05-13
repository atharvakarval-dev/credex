import { NextResponse } from "next/server";
import { auditInputSchema } from "../../../lib/validations";
import { auditRateLimit } from "../../../lib/rate-limit";
import { runAudit } from "../../../lib/audit-engine";
import { getDataSource } from "../../../lib/db";
import { AuditSchema } from "../../../entities/AuditSchema";
import { Audit } from "../../../entities/Audit";
import { generateId } from "../../../lib/utils";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    if (auditRateLimit) {
      // Use IP for rate limiting
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      const { success, limit, reset, remaining } = await auditRateLimit.limit(ip);
      
      if (!success) {
        return NextResponse.json(
          { error: "rate_limited", retryAfter: reset },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            }
          }
        );
      }
    }

    // 2. Parse and Validate Input
    const body = await request.json();
    const validationResult = auditInputSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "validation_failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const input = validationResult.data;

    // 3. Run the pure Audit Engine
    const auditResult = runAudit(input);

    // 4. Persist to DB (Graceful failure for testing/dev)
    let auditId = generateId();
    try {
      const dataSource = await getDataSource();
      const auditRepo = dataSource.getRepository(AuditSchema);
      
      const auditRecord = new Audit();
      auditRecord.id = auditId;
      auditRecord.inputSnapshot = input;
      auditRecord.resultSnapshot = auditResult;
      auditRecord.totalMonthlySavings = auditResult.totalMonthlySavings;
      auditRecord.toolCount = input.tools.length;
      auditRecord.useCase = input.useCase;
      
      await auditRepo.save(auditRecord);
    } catch (dbError) {
      console.error("Audit Persistence Error (Audit will still return result):", dbError);
      // We continue because the user still needs to see their results
    }

    // 5. Return success
    return NextResponse.json({
      auditId: auditId,
      result: auditResult,
    });
    
  } catch (error) {
    console.error("Critical Audit API Error:", error);
    return NextResponse.json(
      { error: "internal_error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
