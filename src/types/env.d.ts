// src/types/env.d.ts
// Environment variable type declarations

declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    DIRECT_URL?: string;

    // Anthropic
    ANTHROPIC_API_KEY: string;

    // Resend
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL: string;

    // Upstash (Rate Limiting)
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;

    // App
    NEXT_PUBLIC_APP_URL: string;

    // Node
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
