import { EntitySchema } from "typeorm";
import { Lead } from "./Lead";

export const LeadSchema = new EntitySchema<Lead>({
  name: "Lead",
  target: Lead,
  columns: {
    id: {
      type: "varchar",
      primary: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    auditId: {
      type: "varchar",
      unique: true,
    },
    email: {
      type: "varchar",
    },
    companyName: {
      type: "varchar",
      nullable: true,
    },
    role: {
      type: "varchar",
      nullable: true,
    },
    teamSize: {
      type: "int",
      nullable: true,
    },
    ipHash: {
      type: "varchar",
      nullable: true,
    },
    emailSentAt: {
      type: "timestamp",
      nullable: true,
    },
    consultationBooked: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    audit: {
      type: "one-to-one",
      target: "Audit",
      joinColumn: {
        name: "auditId",
      },
    },
  },
});
