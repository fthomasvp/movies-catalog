import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schemas/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: String(process.env.DB_URL),
  },
} satisfies Config;
