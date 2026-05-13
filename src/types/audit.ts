// src/types/audit.ts
// Canonical shared types — every other file imports from here.
// Never redefine these shapes locally.

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type ToolId =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

// Maps to the pricing.ts constants — used as index keys
export type CursorPlan    = 'hobby' | 'pro' | 'business' | 'enterprise';
export type CopilotPlan   = 'individual' | 'business' | 'enterprise';
export type ClaudePlan    = 'free' | 'pro' | 'max' | 'team' | 'enterprise' | 'api_direct';
export type ChatGPTPlan   = 'plus' | 'team' | 'enterprise' | 'api_direct';
export type GeminiPlan    = 'pro' | 'ultra' | 'api';
export type WindsurfPlan  = 'free' | 'pro' | 'team';

// Union of all plan types — used for the generic form rows
export type AnyPlan =
  CursorPlan | CopilotPlan | ClaudePlan | ChatGPTPlan | GeminiPlan | WindsurfPlan;

// One entry per tool the user is paying for
export interface ToolEntry {
  toolId:           ToolId;
  plan:             AnyPlan;
  monthlySpend:     number;  // User-reported $ amount, used as override if higher than catalog price
  seats:            number;
}

// Everything submitted from the form
export interface AuditInput {
  tools:    ToolEntry[];
  teamSize: number;
  useCase:  UseCase;
}

// The "verdict" for a single tool — what the engine decided
export type RecommendationType =
  | 'downgrade_plan'       // Same vendor, cheaper plan
  | 'right_size_seats'     // Reduce seat count
  | 'switch_tool'          // Different vendor, similar capability
  | 'use_credits'          // Buy via Credex at discount
  | 'already_optimal'      // No change recommended
  | 'consolidate';         // User has overlapping tools

export interface ToolRecommendation {
  toolId:             ToolId;
  currentPlan:        AnyPlan;
  currentMonthlyCost: number;

  recommendationType: RecommendationType;
  recommendedAction:  string;              // e.g., "Downgrade to Cursor Pro from Business"
  recommendedTool?:   ToolId;             // Populated for switch_tool type
  recommendedPlan?:   AnyPlan;            // The target plan

  projectedMonthlyCost: number;
  monthlySavings:       number;           // currentMonthlyCost - projectedMonthlyCost
  annualSavings:        number;           // monthlySavings * 12

  reasoning:          string;             // 1-sentence human-readable justification
  confidence:         'high' | 'medium' | 'low';  // Low = flag for human review
}

// The full output of the audit engine
export interface AuditResult {
  auditId:              string;           // Matches Audit.id in DB
  recommendations:      ToolRecommendation[];
  totalMonthlySavings:  number;
  totalAnnualSavings:   number;

  // Derived flags — computed once, used throughout UI
  isHighSavings:    boolean;             // totalMonthlySavings > 500
  isAlreadyOptimal: boolean;             // totalMonthlySavings < 100
  hasOverlap:       boolean;             // 2+ tools with same primary use case

  aiSummary?:       string;              // Set async after engine runs
  generatedAt:      string;              // ISO timestamp
}

// API request/response shapes — keep these separate from domain types
export interface RunAuditRequest  { input: AuditInput }
export interface RunAuditResponse { result: AuditResult; auditId: string }

export interface CaptureLeadRequest {
  auditId:     string;
  email:       string;
  companyName?: string;
  role?:        string;
  teamSize?:    number;
}
export interface CaptureLeadResponse { success: boolean; message: string }
