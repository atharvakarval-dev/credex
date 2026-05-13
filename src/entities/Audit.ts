import "reflect-metadata";
import { Entity, PrimaryColumn, CreateDateColumn, Column, OneToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Lead } from "./Lead";

@Entity()
export class Audit {
  @PrimaryColumn()
  id!: string; // cuid generated at creation

  @CreateDateColumn()
  createdAt!: Date;

  // Raw input snapshot â€” store as JSON so schema changes don't break old records
  @Column("jsonb")
  inputSnapshot!: object;

  // Computed results â€” also JSON for same reason
  @Column("jsonb")
  resultSnapshot!: object;

  // Aggregate fields for quick queries (avoid deserializing JSON for dashboards)
  @Column("float")
  totalMonthlySavings!: number;

  @Column("int")
  toolCount!: number;

  @Column()
  useCase!: string; // 'coding' | 'writing' | 'data' | 'research' | 'mixed'

  // Relationship to lead (optional â€” audit exists before lead capture)
  @OneToOne(() => Lead, (lead) => lead.audit)
  lead?: Relation<Lead>;
}

