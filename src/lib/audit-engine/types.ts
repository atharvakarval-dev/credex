import { ToolEntry, UseCase, ToolRecommendation } from "../../types/audit";

export interface AuditContext {
  teamSize: number;
  useCase: UseCase;
}

export type AuditRule = (
  entry: ToolEntry,
  allEntries: ToolEntry[],
  context: AuditContext
) => Partial<ToolRecommendation> | null;
