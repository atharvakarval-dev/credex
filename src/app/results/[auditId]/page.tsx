import { getDataSource } from "../../../lib/db";
import { AuditSchema } from "../../../entities/AuditSchema";
import { notFound } from "next/navigation";
import { formatCurrency } from "../../../lib/utils";
import { AuditResult, ToolRecommendation } from "../../../types/audit";
import { Metadata } from "next";
import { AiSummary } from "../../../components/results/AiSummary";
import { CredexCTA } from "../../../components/results/CredexCTA";
import { ShareButton } from "../../../components/results/ShareButton";
import { AlertTriangle, ArrowDownRight, Lightbulb, RefreshCw } from "lucide-react";

interface ResultsPageProps {
  params: {
    auditId: string;
  };
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const { auditId } = await params;
  return {
    title: "Your Credex Spend Audit Results",
    description: "See exactly how much you can save on your AI tool stack.",
    openGraph: {
      images: [`/api/og?auditId=${auditId}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og?auditId=${auditId}`],
    },
  };
}

const iconMap = {
  downgrade_plan: <ArrowDownRight className="w-5 h-5 text-blue-400" />,
  right_size_seats: <RefreshCw className="w-5 h-5 text-purple-400" />,
  switch_tool: <Lightbulb className="w-5 h-5 text-amber-400" />,
  consolidate: <AlertTriangle className="w-5 h-5 text-red-400" />,
  use_credits: <Lightbulb className="w-5 h-5 text-emerald-400" />,
  already_optimal: <Lightbulb className="w-5 h-5 text-[#E1E0CC]/40" />,
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { auditId } = await params;
  let auditRecord = null;

  try {
    const dataSource = await getDataSource();
    const auditRepo = dataSource.getRepository(AuditSchema);
    auditRecord = await auditRepo.findOne({
      where: { id: auditId },
    });
    } catch (e) {
      console.error("DB Fetch Error:", e);
      throw e; // No longer using hardcoded mock to ensure user sees real data
    }

  if (!auditRecord) {
    notFound();
  }

  const result = auditRecord.resultSnapshot as unknown as AuditResult;
  const isHighSavings = result.totalAnnualSavings > 5000;

  return (
    <div className="min-h-screen bg-[#000] text-[#E1E0CC] selection:bg-[#E1E0CC]/20 pb-20 pt-20">
      {/* Cinematic Header Section */}
      <div className="relative overflow-hidden border-b border-[#E1E0CC]/10 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto py-20 px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-[#E1E0CC]/20 bg-[#E1E0CC]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E1E0CC]/80">
                Audit Complete
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Your Optimization <br />
                <span className="italic font-light">Playbook</span>
              </h1>
              <p className="text-lg md:text-xl text-[#E1E0CC]/60 font-light leading-relaxed">
                We&apos;ve analyzed your {auditRecord.toolCount}-tool stack. Here is exactly where you are overpaying and how to reclaim your capital.
              </p>
            </div>
            <div className="pb-2">
              <ShareButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${isHighSavings ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]' : 'bg-[#111] border-[#E1E0CC]/10'}`}>
              <p className="text-[10px] font-bold text-[#E1E0CC]/40 uppercase tracking-[0.2em] mb-4">Total Annual Savings</p>
              <p className={`text-6xl md:text-7xl font-bold tracking-tighter ${isHighSavings ? 'text-emerald-400' : 'text-[#E1E0CC]'}`}>
                {formatCurrency(result.totalAnnualSavings)}
              </p>
              <p className="text-sm font-medium text-[#E1E0CC]/40 mt-4 flex items-center gap-2">
                Equivalent to <span className="text-[#E1E0CC] font-bold">{formatCurrency(result.totalMonthlySavings)}</span> back in your pocket every month.
              </p>
            </div>
            
            <AiSummary auditId={auditId} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto py-20 px-4 sm:px-6 space-y-24">
        
        {/* Action Items Breakdown */}
        <section>
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Action Items</h2>
            <span className="bg-[#E1E0CC]/5 text-[#E1E0CC]/60 border border-[#E1E0CC]/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              {result.recommendations.length} Recommendations
            </span>
          </div>

          {result.recommendations.length > 0 ? (
            <div className="grid gap-6">
              {result.recommendations.map((rec: ToolRecommendation, idx: number) => {
                return (
                  <div key={idx} className="group p-8 md:p-10 rounded-[2.5rem] bg-[#0a0a0a] border border-[#E1E0CC]/5 transition-all duration-500 hover:border-[#E1E0CC]/20 hover:bg-[#111]">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      
                      <div className="flex gap-6">
                        <div className="mt-1 bg-black p-3 rounded-2xl border border-[#E1E0CC]/10 h-14 w-14 flex items-center justify-center shrink-0">
                          {iconMap[rec.recommendationType]}
                        </div>
                        <div className="space-y-4">
                          <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#E1E0CC]/50 bg-[#E1E0CC]/5 border border-[#E1E0CC]/10 rounded-lg">
                            {rec.recommendationType.replace(/_/g, " ")}
                          </span>
                          <h3 className="text-2xl font-bold text-[#E1E0CC]">{rec.recommendedAction}</h3>
                          <p className="text-[#E1E0CC]/60 leading-relaxed max-w-2xl font-light">{rec.reasoning}</p>
                          
                          {rec.recommendedTool && (
                            <div className="mt-6 inline-flex items-center gap-3 bg-black px-4 py-2 rounded-xl border border-[#E1E0CC]/10 text-xs font-medium">
                              <span className="text-[#E1E0CC]/40 uppercase tracking-widest">Alternative</span>
                              <span className="font-bold text-[#E1E0CC]">{rec.recommendedTool}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {rec.monthlySavings > 0 && (
                        <div className="md:text-right bg-black px-6 py-5 rounded-[1.5rem] border border-[#E1E0CC]/10 min-w-[180px] flex-shrink-0 group-hover:border-emerald-500/30 transition-colors">
                          <p className="text-[10px] font-bold text-[#E1E0CC]/40 uppercase tracking-[0.2em] mb-2">Monthly Impact</p>
                          <p className="text-3xl font-bold text-emerald-400">+{formatCurrency(rec.monthlySavings)}</p>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-20 bg-[#0a0a0a] border border-emerald-500/10 rounded-[3rem] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] -z-10" />
              <div className="mx-auto bg-black w-20 h-20 flex items-center justify-center rounded-3xl border border-emerald-500/20 mb-8 shadow-2xl">
                <Lightbulb className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-[#E1E0CC] mb-4 tracking-tight">Your stack is perfectly optimized!</h3>
              <p className="text-[#E1E0CC]/60 text-lg max-w-xl mx-auto font-light leading-relaxed">
                Our global network couldn&apos;t find any wasted spend in your current configuration. You are operating at peak efficiency.
              </p>
            </div>
          )}
        </section>

        <CredexCTA auditId={auditId} totalAnnualSavings={result.totalAnnualSavings} />

      </div>
    </div>
  );
}
