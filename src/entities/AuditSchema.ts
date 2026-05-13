import { EntitySchema } from "typeorm";
import { Audit } from "./Audit";

export const AuditSchema = new EntitySchema<Audit>({
  name: "Audit",
  target: Audit,
  columns: {
    id: {
      type: "varchar",
      primary: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    inputSnapshot: {
      type: "jsonb",
    },
    resultSnapshot: {
      type: "jsonb",
    },
    totalMonthlySavings: {
      type: "float",
    },
    toolCount: {
      type: "int",
    },
    useCase: {
      type: "varchar",
    },
  },
  relations: {
    lead: {
      type: "one-to-one",
      target: "Lead",
      joinColumn: false,
      inverseSide: "audit",
    },
  },
});
