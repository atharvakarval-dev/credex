"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { LeadCaptureModal } from "./LeadCaptureModal";
import { formatCurrency } from "../../lib/utils";
import { motion } from "framer-motion";

interface CredexCTAProps {
  auditId: string;
  totalAnnualSavings: number;
}

export function CredexCTA({ auditId, totalAnnualSavings }: CredexCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);

  return (
    <>
      <div className="mt-24 bg-[#0a0a0a] text-[#E1E0CC] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-[#E1E0CC]/10 shadow-[0_0_100px_rgba(225,224,204,0.03)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#E1E0CC]/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Sparkles className="h-12 w-12 text-[#E1E0CC] mx-auto mb-8 opacity-40" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Stop overpaying <br />
              <span className="italic font-light">for AI.</span>
            </h2>
            <p className="text-lg md:text-xl text-[#E1E0CC]/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              You&apos;re leaving <strong className="text-[#E1E0CC] font-bold">{formatCurrency(totalAnnualSavings)}</strong> on the table every year. 
              Let Credex handle your vendor negotiations, consolidate your licenses, and unlock wholesale pricing through our worldwide syndicate.
            </p>
            
            {hasCaptured ? (
              <div className="inline-flex items-center gap-3 bg-[#E1E0CC]/10 text-[#E1E0CC] px-8 py-5 rounded-2xl border border-[#E1E0CC]/20">
                <span className="font-bold uppercase tracking-widest text-xs text-emerald-400">Action Required:</span>
                <span className="font-medium tracking-tight">Playbook sent to your email. Check your inbox.</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <Button 
                  size="lg" 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#E1E0CC] hover:bg-[#E1E0CC]/90 text-black font-bold text-lg px-12 py-8 rounded-full transition-all hover:scale-105 shadow-2xl shadow-[#E1E0CC]/10"
                >
                  Get the Free Playbook
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#E1E0CC]/30">
                  Exclusive access for funded startups
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <LeadCaptureModal 
        auditId={auditId} 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={() => setHasCaptured(true)}
      />
    </>
  );
}
