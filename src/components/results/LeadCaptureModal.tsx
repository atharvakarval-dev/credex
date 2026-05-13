"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";

interface LeadCaptureModalProps {
  auditId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LeadCaptureModal({ auditId, isOpen, onOpenChange, onSuccess }: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, email, companyName, website }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      toast.success("Intelligence sent successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (_err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#0a0a0a] border-[#E1E0CC]/10 text-[#E1E0CC] p-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] pointer-events-none" />
        
        <div className="p-8 md:p-12 space-y-8 relative z-10">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-bold tracking-tight">
              Unlock Your <span className="italic font-light text-emerald-400">Playbook</span>
            </DialogTitle>
            <DialogDescription className="text-base text-[#E1E0CC]/60 font-light leading-relaxed">
              Enter your work email to receive the full step-by-step negotiation strategy and wholesale pricing benchmarks for your stack.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E1E0CC]/40">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border-[#E1E0CC]/10 text-[#E1E0CC] h-14 rounded-2xl focus-visible:ring-[#E1E0CC]/20"
                  autoFocus
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="companyName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E1E0CC]/40">Company (Optional)</Label>
                <Input 
                  id="companyName" 
                  type="text" 
                  placeholder="Acme Labs" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-black border-[#E1E0CC]/10 text-[#E1E0CC] h-14 rounded-2xl focus-visible:ring-[#E1E0CC]/20"
                />
              </div>
              {/* Honeypot field */}
              <div className="absolute opacity-0 -z-50 pointer-events-none" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  type="text" 
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-[#E1E0CC]/40 bg-black/50 p-4 rounded-2xl border border-[#E1E0CC]/5 font-medium uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4 text-emerald-500/50 flex-shrink-0" />
              <span>Worldwide Syndicate Security Policy Enabled</span>
            </div>

            <Button type="submit" className="w-full h-16 text-lg font-bold bg-[#E1E0CC] hover:bg-[#E1E0CC]/90 text-black rounded-2xl transition-all shadow-xl shadow-[#E1E0CC]/5" disabled={isSubmitting || !email}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <>
                  Access Playbook
                  <ArrowRight className="ml-2 h-6 w-6" />
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

