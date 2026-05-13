"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Loader2, Users, Target, LayoutGrid } from "lucide-react";
import { auditInputSchema, ValidatedAuditInput } from "../../lib/validations";
import { saveFormState, loadFormState, clearFormState } from "../../lib/storage";
import { ToolRow } from "./ToolRow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Building2, ShieldCheck, Sparkles, User } from "lucide-react";

export function AuditForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [pendingAuditId, setPendingAuditId] = useState<string | null>(null);
  const [isCapturingLead, setIsCapturingLead] = useState(false);
  const [leadForm, setLeadForm] = useState<{ name: string; email: string; companyName: string; role: string }>({ 
    name: "", 
    email: "", 
    companyName: "", 
    role: "" 
  });

  const form = useForm<ValidatedAuditInput>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: {
      teamSize: 1,
      useCase: "coding",
      tools: [
        { toolId: "cursor", plan: "pro", seats: 1, monthlySpend: 20 }
      ],
    },
  });

  const { control, handleSubmit, register, setValue, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  // Load persisted form state on mount
  useEffect(() => {
    const saved = loadFormState();
    if (saved) {
      if (saved.teamSize !== undefined) setValue("teamSize", saved.teamSize);
      if (saved.useCase !== undefined) setValue("useCase", saved.useCase);
      if (saved.tools && saved.tools.length > 0) setValue("tools", saved.tools as ValidatedAuditInput["tools"]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save form state to localStorage on every change
  useEffect(() => {
    const subscription = form.watch((values) => {
      saveFormState(values as Partial<ValidatedAuditInput>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: ValidatedAuditInput) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      
      // Instead of direct redirect, show lead dialog
      setPendingAuditId(json.auditId);
      setShowLeadDialog(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAuditId || !leadForm.email) return;

    setIsCapturingLead(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId: pendingAuditId,
          name: leadForm.name,
          email: leadForm.email,
          companyName: leadForm.companyName,
          role: leadForm.role,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        // If already exists, we still want to show them the results
        if (json.error !== "lead_already_captured") {
          throw new Error(json.error);
        }
      }

      clearFormState();
      router.push(`/results/${pendingAuditId}`);
    } catch (err) {
      console.error("Lead capture failed:", err);
      // Fallback: still show results if lead capture fails to not block the user experience
      router.push(`/results/${pendingAuditId}`);
    } finally {
      setIsCapturingLead(false);
    }
  };

  const useCase = watch("useCase");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      
      {/* Precision Configuration */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Team Size Card */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/30">
            <Users className="h-3 w-3" /> Team Dimension
          </div>
          <div className="relative">
            <input 
              type="number"
              {...register("teamSize", { valueAsNumber: true })}
              className="h-14 w-full bg-white/5 border border-white/10 rounded-xl px-6 text-2xl font-black text-[#E1E0CC] focus:ring-1 focus:ring-[#E1E0CC]/20 transition-all font-mono"
              suppressHydrationWarning
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#E1E0CC]/20">PERSONNEL</div>
          </div>
        </div>

        {/* Use Case Card */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/30">
            <Target className="h-3 w-3" /> Core Intelligence Focus
          </div>
          <Select 
            value={useCase} 
            onValueChange={(val) => setValue("useCase", (val || "coding") as ValidatedAuditInput["useCase"], { shouldValidate: true })}
          >
            <SelectTrigger 
              className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-sm font-bold text-[#E1E0CC] hover:bg-white/10 transition-all shadow-none ring-0"
              suppressHydrationWarning
            >
              <SelectValue placeholder="Select Focus" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20 text-[#E1E0CC] rounded-2xl backdrop-blur-3xl min-w-[280px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-[1.5px]">
              <SelectItem value="coding" className="py-4 px-6 font-bold focus:bg-[#E1E0CC] focus:text-black rounded-xl cursor-pointer">Engineering Operations</SelectItem>
              <SelectItem value="writing" className="py-4 px-6 font-bold focus:bg-[#E1E0CC] focus:text-black rounded-xl cursor-pointer">Content / Research</SelectItem>
              <SelectItem value="data" className="py-4 px-6 font-bold focus:bg-[#E1E0CC] focus:text-black rounded-xl cursor-pointer">Data Architecture</SelectItem>
              <SelectItem value="research" className="py-4 px-6 font-bold focus:bg-[#E1E0CC] focus:text-black rounded-xl cursor-pointer">Strategic Planning</SelectItem>
              <SelectItem value="mixed" className="py-4 px-6 font-bold focus:bg-[#E1E0CC] focus:text-black rounded-xl cursor-pointer">Unified Intelligence</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Subscription Registry */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-4 w-4 text-[#E1E0CC]/40" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1E0CC]/40">Active Nodes</h3>
          </div>
          <div className="text-[10px] font-mono text-[#E1E0CC]/20 tracking-tighter">{fields.length} Subscriptions Tracked</div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ToolRow 
                  index={index} 
                  form={form} 
                  onRemove={() => remove(index)} 
                  canRemove={fields.length > 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button 
          type="button" 
          onClick={() => append({ toolId: "chatgpt", plan: "plus", seats: 1, monthlySpend: 20 })}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl border border-dashed border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1E0CC]/20 hover:text-[#E1E0CC]/60 hover:bg-white/[0.02] transition-all group"
          suppressHydrationWarning
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          Add Integration Node
        </button>
      </div>

      {/* Execution Layer */}
      <div className="pt-8">
        <button 
          type="submit" 
          className="group relative w-full h-16 rounded-2xl bg-[#E1E0CC] hover:bg-white text-black font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-black/40 overflow-hidden"
          disabled={isSubmitting}
          suppressHydrationWarning
        >
          <div className="relative z-10 flex items-center justify-center gap-4">
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Running Audit...</span>
              </>
            ) : (
              <>
                <span>Run Intelligence Audit</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </button>
        
        <div className="mt-8 flex justify-center items-center gap-6 opacity-20">
          <div className="h-[1px] w-12 bg-[#E1E0CC]" />
          <div className="text-[9px] font-black uppercase tracking-[0.4em]">Audit Terminal v1.4.2</div>
          <div className="h-[1px] w-12 bg-[#E1E0CC]" />
        </div>
      </div>

      {/* Lead Capture Dialog */}
      <Dialog open={showLeadDialog} onOpenChange={(open) => !isCapturingLead && setShowLeadDialog(open)}>
        <DialogContent className="bg-[#050505] border-white/10 text-[#E1E0CC] p-0 overflow-hidden max-w-md rounded-[2rem]">
          <div className="relative p-8 space-y-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E1E0CC]/40 to-transparent" />
            
            <DialogHeader className="space-y-4">
              <div className="mx-auto bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                <ShieldCheck className="h-8 w-8 text-[#E1E0CC]" />
              </div>
              <DialogTitle className="text-2xl font-bold text-center tracking-tight">Secure Your Results</DialogTitle>
              <DialogDescription className="text-[#E1E0CC]/60 text-center text-sm font-light leading-relaxed">
                Your intelligence audit is ready. Enter your details to unlock the full optimization playbook and receive a copy via email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onLeadSubmit} className="space-y-6">
              <div className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="lead-name" className="text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/40 ml-1">Your Name</Label>
                  <div className="relative">
                    <Input
                      id="lead-name"
                      type="text"
                      required
                      placeholder="Alex Johnson"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 focus:ring-1 focus:ring-[#E1E0CC]/20 transition-all text-sm font-medium"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E1E0CC]/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-email" className="text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/40 ml-1">Business Email</Label>
                  <div className="relative">
                    <Input 
                      id="lead-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 focus:ring-1 focus:ring-[#E1E0CC]/20 transition-all text-sm font-medium"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E1E0CC]/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-company" className="text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/40 ml-1">Company Name</Label>
                  <div className="relative">
                    <Input 
                      id="lead-company"
                      type="text"
                      placeholder="Acme Corp"
                      value={leadForm.companyName}
                      onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 rounded-xl pl-12 focus:ring-1 focus:ring-[#E1E0CC]/20 transition-all text-sm font-medium"
                    />
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E1E0CC]/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-role" className="text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/40 ml-1">Your Role</Label>
                  <Select
                    value={leadForm.role}
                    onValueChange={(val) => setLeadForm({ ...leadForm, role: val || "" })}
                  >
                    <SelectTrigger
                      id="lead-role"
                      className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-sm font-medium text-[#E1E0CC] hover:bg-white/10 transition-all"
                    >
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 text-[#E1E0CC] rounded-2xl backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-[1.5px]">
                      <SelectItem value="founder" className="py-3 px-5 rounded-xl font-bold cursor-pointer focus:bg-[#E1E0CC] focus:text-black">Founder / CEO</SelectItem>
                      <SelectItem value="cto" className="py-3 px-5 rounded-xl font-bold cursor-pointer focus:bg-[#E1E0CC] focus:text-black">CTO / VP Engineering</SelectItem>
                      <SelectItem value="finance" className="py-3 px-5 rounded-xl font-bold cursor-pointer focus:bg-[#E1E0CC] focus:text-black">Finance / CFO</SelectItem>
                      <SelectItem value="engineering_lead" className="py-3 px-5 rounded-xl font-bold cursor-pointer focus:bg-[#E1E0CC] focus:text-black">Engineering Lead</SelectItem>
                      <SelectItem value="individual" className="py-3 px-5 rounded-xl font-bold cursor-pointer focus:bg-[#E1E0CC] focus:text-black">Individual Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <button
                type="submit"
                disabled={isCapturingLead}
                className="w-full h-14 bg-[#E1E0CC] hover:bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {isCapturingLead ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Unlock Playbook</span>
                  </>
                )}
              </button>

              <p className="text-[9px] text-center text-[#E1E0CC]/30 font-medium leading-relaxed">
                By unlocking, you agree to receive a one-time audit report and strategic updates. <br />
                We respect your inbox. No spam, ever.
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>

    </form>
  );
}


