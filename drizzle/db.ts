import { Pool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL });
export const db = drizzle(pool, { schema });
