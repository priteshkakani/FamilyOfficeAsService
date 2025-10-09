import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from './db';

async function main() {
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  console.log('Migration complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
