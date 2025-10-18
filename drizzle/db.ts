import { Pool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });
// drizzle expects a VercelPgClient type in some environments — cast to any to avoid
// a type mismatch during local builds where pool is a standard Pool.
export const db = drizzle(pool as any, { schema });
