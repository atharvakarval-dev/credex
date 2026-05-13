import { z } from "zod";
import { UseCase, ToolId, AnyPlan } from "../types/audit";

// We define the literal values based on the types to validate the incoming string
const USE_CASES: [UseCase, ...UseCase[]] = ["coding", "writing", "data", "research", "mixed"];

const TOOL_IDS: [ToolId, ...ToolId[]] = [
  "cursor",
  "github_copilot",
  "claude",
  "chatgpt",
  "anthropic_api",
  "openai_api",
  "gemini",
  "windsurf",
];

const PLANS: [AnyPlan, ...AnyPlan[]] = [
  "hobby",
  "pro",
  "business",
  "enterprise",
  "individual",
  "free",
  "max",
  "team",
  "api_direct",
  "plus",
  "ultra",
  "api",
];

export const toolEntrySchema = z.object({
  toolId: z.enum(TOOL_IDS),
  plan: z.enum(PLANS),
  monthlySpend: z.number().min(0, "Monthly spend cannot be negative"),
  seats: z.number().int().min(1, "Seats must be at least 1"),
});

export const auditInputSchema = z.object({
  teamSize: z.number().int().min(1, "Team size must be at least 1"),
  useCase: z.enum(USE_CASES),
  tools: z.array(toolEntrySchema).min(1, "You must specify at least one tool"),
});

// Used for parsing API responses or checking
export type ValidatedAuditInput = z.infer<typeof auditInputSchema>;

