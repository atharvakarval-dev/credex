"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Cpu, Users, CreditCard, LayoutGrid } from "lucide-react";
import { ToolId, AnyPlan } from "../../types/audit";
import { ValidatedAuditInput } from "../../lib/validations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ToolRowProps {
  index: number;
  form: UseFormReturn<ValidatedAuditInput>;
  onRemove: () => void;
  canRemove: boolean;
}

const TOOL_OPTIONS = [
  { value: "cursor", label: "Cursor" },
  { value: "github_copilot", label: "GitHub Copilot" },
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "windsurf", label: "Windsurf" },
  { value: "anthropic_api", label: "Anthropic API" },
  { value: "openai_api", label: "OpenAI API" },
  { value: "gemini", label: "Gemini" },
];

const PLAN_MAP: Record<ToolId, { value: AnyPlan; label: string }[]> = {
  cursor: [
    { value: "hobby", label: "Hobby" },
    { value: "pro", label: "Pro" },
    { value: "business", label: "Business" },
    { value: "enterprise", label: "Enterprise" },
  ],
  github_copilot: [
    { value: "individual", label: "Individual" },
    { value: "business", label: "Business" },
    { value: "enterprise", label: "Enterprise" },
  ],
  claude: [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "max", label: "Max" },
    { value: "team", label: "Team" },
    { value: "enterprise", label: "Enterprise" },
    { value: "api_direct", label: "API Direct" },
  ],
  chatgpt: [
    { value: "plus", label: "Plus" },
    { value: "team", label: "Team" },
    { value: "enterprise", label: "Enterprise" },
    { value: "api_direct", label: "API Direct" },
  ],
  anthropic_api: [{ value: "api_direct", label: "API Direct" }],
  openai_api: [{ value: "api_direct", label: "API Direct" }],
  gemini: [
    { value: "pro", label: "Pro" },
    { value: "ultra", label: "Ultra" },
    { value: "api", label: "API" },
  ],
  windsurf: [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ],
};

export function ToolRow({ index, form, onRemove, canRemove }: ToolRowProps) {
  const { register, setValue, watch } = form;

  const toolId = watch(`tools.${index}.toolId`) as ToolId;
  const currentPlan = watch(`tools.${index}.plan`);

  // Ensure plan is valid for the tool
  useEffect(() => {
    const plans = PLAN_MAP[toolId] || [];
    if (!plans.some((p) => p.value === currentPlan)) {
      setValue(`tools.${index}.plan`, plans[0]?.value || ("free" as any), { shouldValidate: true });
    }
  }, [toolId, index, currentPlan, setValue]);

  return (
    <div className="group flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-5 rounded-2xl transition-all duration-300">
      
      {/* Node Selector */}
      <div className="w-full lg:w-[180px] shrink-0">
        <Select 
          value={toolId} 
          onValueChange={(val) => setValue(`tools.${index}.toolId`, (val || "cursor") as ToolId, { shouldValidate: true })}
        >
          <SelectTrigger 
            className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-xs font-bold text-[#E1E0CC] hover:bg-white/10 transition-all"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-3">
              <Cpu className="h-3.5 w-3.5 opacity-40" />
              <SelectValue placeholder="Node" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-black border-white/20 text-[#E1E0CC] rounded-2xl backdrop-blur-3xl min-w-[200px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-[1.5px]">
            {TOOL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#E1E0CC] focus:text-black py-3 px-5 rounded-xl font-bold cursor-pointer transition-colors">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plan Selector */}
      <div className="w-full lg:w-[160px] shrink-0">
        <Select 
          value={currentPlan} 
          onValueChange={(val) => setValue(`tools.${index}.plan`, (val || "pro") as AnyPlan, { shouldValidate: true })}
        >
          <SelectTrigger 
            className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-xs font-bold text-[#E1E0CC] hover:bg-white/10 transition-all"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-3.5 w-3.5 opacity-40" />
              <SelectValue placeholder="Plan" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-black border-white/20 text-[#E1E0CC] rounded-2xl backdrop-blur-3xl min-w-[160px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-[1.5px]">
            {(PLAN_MAP[toolId] || []).map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#E1E0CC] focus:text-black py-3 px-5 rounded-xl font-bold cursor-pointer transition-colors">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bandwidth (Seats) */}
      <div className="w-full lg:w-[110px] relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Users className="h-3.5 w-3.5 opacity-30 text-[#E1E0CC]" />
        </div>
        <input 
          type="number"
          {...register(`tools.${index}.seats`, { valueAsNumber: true })}
          className="h-12 w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-xs font-bold text-[#E1E0CC] focus:ring-1 focus:ring-[#E1E0CC]/20 transition-all font-mono"
          placeholder="Seats"
          suppressHydrationWarning
        />
      </div>

      {/* Capital (Spend) */}
      <div className="w-full lg:flex-1 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <CreditCard className="h-3.5 w-3.5 opacity-30 text-[#E1E0CC]" />
        </div>
        <div className="relative">
           <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-bold opacity-30 text-[#E1E0CC]">$</span>
           <input 
            type="number"
            {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
            className="h-12 w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-xs font-bold text-[#E1E0CC] focus:ring-1 focus:ring-[#E1E0CC]/20 transition-all font-mono"
            placeholder="0.00"
            suppressHydrationWarning
          />
        </div>
      </div>

      {/* Remove Action */}
      <div className="flex shrink-0 w-full lg:w-auto justify-end">
        <button 
          type="button" 
          onClick={onRemove}
          disabled={!canRemove}
          className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${canRemove ? 'text-white/10 hover:text-red-400 hover:bg-red-400/10' : 'opacity-0'}`}
          suppressHydrationWarning
        >
          <X className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}

