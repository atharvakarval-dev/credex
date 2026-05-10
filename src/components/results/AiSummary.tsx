// AiSummary: streams executive summary from /api/summary with skeleton fallback
"use client";

import React, { useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface AiSummaryProps {
  auditId: string;
}

export function AiSummary({ auditId }: AiSummaryProps) {
  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/summary",
  });

  const hasInitiated = React.useRef<string | null>(null);

  useEffect(() => {
    if (completion) {
      console.log("[AI SUMMARY] Completion updated (length):", completion.length);
    }
  }, [completion]);

  useEffect(() => {
    if (auditId && hasInitiated.current !== auditId) {
      console.log("[AI SUMMARY] Initiating fetch for:", auditId);
      hasInitiated.current = auditId;
      complete("Generate executive summary", { body: { auditId } });
    }
  }, [auditId, complete]);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-[#E1E0CC]/10 bg-[#0a0a0a] transition-all duration-500 hover:border-[#E1E0CC]/20 shadow-2xl">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E1E0CC]/20" />
      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-5 w-5 text-[#E1E0CC]" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E1E0CC]/80">
            Executive Summary
          </h3>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#E1E0CC]/40 ml-2" />}
        </div>
        
        {error ? (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm font-light">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-1">Unable to generate AI insights</p>
              <p className="opacity-80">Our intelligence node is currently under heavy load. Please try refreshing in a moment.</p>
            </div>
          </div>
        ) : (
          <div className="text-[#E1E0CC]/70 leading-relaxed min-h-[120px] font-light text-base md:text-lg italic">
            {completion ? (
              <p className="whitespace-pre-wrap">{completion}</p>
            ) : (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-3 w-full bg-[#E1E0CC]/5" />
                <Skeleton className="h-3 w-[90%] bg-[#E1E0CC]/5" />
                <Skeleton className="h-3 w-[95%] bg-[#E1E0CC]/5" />
                <Skeleton className="h-3 w-[85%] bg-[#E1E0CC]/5" />
              </div>
            )}
            {isLoading && completion && (
              <span className="inline-block w-1 h-5 ml-2 bg-[#E1E0CC] animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

