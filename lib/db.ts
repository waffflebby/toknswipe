import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/shared/schema';

// Initialize Postgres client (Supabase-compatible)
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });
