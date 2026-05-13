import { ImageResponse } from "next/og";
import { getDataSource } from "../../../lib/db";
import { Audit } from "../../../entities";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");

    let savingsAmount = "$0";

    if (auditId) {
      const dataSource = await getDataSource();
      const auditRepo = dataSource.getRepository(Audit);
      const record = await auditRepo.findOne({ where: { id: auditId } });
      if (record) {
        savingsAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(record.totalMonthlySavings * 12);
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a", // slate-900
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
              border: "2px solid #334155",
              borderRadius: "24px",
              padding: "60px",
              width: "100%",
              height: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <line x1="12" y1="22" x2="12" y2="12"></line>
              </svg>
              <h1 style={{ fontSize: 48, fontWeight: "bold", color: "#f8fafc", marginLeft: "20px" }}>
                Credex AI Spend Audit
              </h1>
            </div>

            <p style={{ fontSize: 32, color: "#94a3b8", textAlign: "center", marginBottom: "20px" }}>
              We found annual savings of
            </p>
            <h2
              style={{
                fontSize: 100,
                fontWeight: "900",
                color: "#10b981", // emerald-500
                margin: 0,
                textShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              {savingsAmount}
            </h2>
            <p style={{ fontSize: 28, color: "#f8fafc", textAlign: "center", marginTop: "40px" }}>
              Optimize your AI tool stack and stop wasting money.
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : "Unknown error"}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
