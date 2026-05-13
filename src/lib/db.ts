import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuditSchema } from "../entities/AuditSchema";
import { LeadSchema } from "../entities/LeadSchema";

const createDataSource = () => {
  return new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // Disabled to prevent Neon "duplicate key" race conditions on hot-reload
    logging: process.env.NODE_ENV === "development",
    entities: [AuditSchema, LeadSchema],
    subscribers: [],
    migrations: [],
  });
};

// Next.js hot-reloading can create multiple DB connections.
// This prevents connection limit exhaustion in development.
const globalForTypeORM = global as unknown as {
  typeormDataSource: DataSource;
};

export const AppDataSource =
  globalForTypeORM.typeormDataSource || createDataSource();

if (process.env.NODE_ENV !== "production") {
  globalForTypeORM.typeormDataSource = AppDataSource;
}

export const getDataSource = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return AppDataSource;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Database Connection Failed:", error instanceof Error ? error.message : String(error));
    }
    throw new Error("DATABASE_CONNECTION_ERROR: Please verify your Neon PostgreSQL connection in .env.local.");
  }
};
