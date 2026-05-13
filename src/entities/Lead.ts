import "reflect-metadata";
import { Entity, PrimaryColumn, CreateDateColumn, Column, OneToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Audit } from "./Audit";

@Entity()
export class Lead {
  @PrimaryColumn()
  id!: string; // cuid generated at creation

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ unique: true })
  auditId!: string;

  @OneToOne(() => Audit)
  @JoinColumn({ name: "auditId" })
  audit!: Relation<Audit>;

  @Column()
  email!: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true, type: "int" })
  teamSize?: number;

  // For abuse detection / deduplication
  @Column({ nullable: true })
  ipHash?: string; // SHA-256 of IP, never raw IP

  // Track conversion funnel
  @Column({ nullable: true })
  emailSentAt?: Date;

  @Column({ default: false })
  consultationBooked!: boolean;
}
