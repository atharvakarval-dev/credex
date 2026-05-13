import { ToolId } from "../../types/audit";

export const PRICING = {
  cursor: {
    hobby: { monthly: 0, annual: 0 },
    pro: { monthly: 20, annual: 192 }, // $16/mo billed annually
    business: { monthly: 40, annual: 384 },
    enterprise: { monthly: null, annual: null }, // Custom â€” flag for manual review
  },
  github_copilot: {
    individual: { monthly: 10, annual: 100 },
    business: { monthly: 19, annual: null },
    enterprise: { monthly: 39, annual: null },
  },
  claude: {
    free: { monthly: 0, annual: 0 },
    pro: { monthly: 20, annual: null },
    max: { monthly: 100, annual: null },
    team: { monthly: 30, annual: null }, // per seat
    enterprise: { monthly: null, annual: null },
    api_direct: { monthly: null, annual: null }, // Usage-based, user enters manually
  },
  chatgpt: {
    plus: { monthly: 20, annual: null },
    team: { monthly: 30, annual: null }, // per seat
    enterprise: { monthly: null, annual: null },
    api_direct: { monthly: null, annual: null },
  },
  gemini: {
    pro: { monthly: 0, annual: 0 }, // Free tier
    ultra: { monthly: 20, annual: null },
    api: { monthly: null, annual: null },
  },
  windsurf: {
    free: { monthly: 0, annual: 0 },
    pro: { monthly: 15, annual: 144 },
    team: { monthly: 35, annual: null },
  },
} as const;

// Functional overlap matrix â€” used by consolidation rule
// 1.0 = identical use case, 0.0 = no overlap
export const TOOL_OVERLAP: Record<ToolId, Partial<Record<ToolId, number>>> = {
  cursor: { windsurf: 0.95, github_copilot: 0.75 },
  windsurf: { cursor: 0.95, github_copilot: 0.75 },
  github_copilot: { cursor: 0.75, windsurf: 0.75 },
  claude: { chatgpt: 0.70, gemini: 0.65 },
  chatgpt: { claude: 0.70, gemini: 0.65 },
  gemini: { claude: 0.65, chatgpt: 0.65 },
  anthropic_api: { openai_api: 0.80 },
  openai_api: { anthropic_api: 0.80 },
};

