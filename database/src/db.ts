import { createClient } from '@libsql/client';
import path from 'path';
import dotenv from 'dotenv';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

let dbInstance: any = null;

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  // Use the environment variables if provided, otherwise fallback to local sqlite file
  const url = process.env.DATABASE_URL || `file:${path.join(__dirname, '../../dev.db')}`;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  const client = createClient({
    url,
    authToken,
  });

  // Create a wrapper that mimics the `sqlite` package API
  dbInstance = {
    client,
    get: async (sql: string, args: any[] = []) => {
      const result = await client.execute({ sql, args });
      if (result.rows.length === 0) return undefined;
      return result.rows[0];
    },
    all: async (sql: string, args: any[] = []) => {
      const result = await client.execute({ sql, args });
      return result.rows;
    },
    run: async (sql: string, args: any[] = []) => {
      // LibSQL doesn't support generic BEGIN TRANSACTION commands outside of a transaction client in HTTP mode
      // For simple compatibility, we will bypass them. 
      if (sql.toUpperCase().includes("BEGIN TRANSACTION") || sql.toUpperCase().includes("COMMIT") || sql.toUpperCase().includes("ROLLBACK")) {
        return { lastID: null, changes: 0 };
      }
      const result = await client.execute({ sql, args });
      return { lastID: result.lastInsertRowid?.toString(), changes: result.rowsAffected };
    },
    exec: async (sql: string) => {
      const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
      for (const stmt of statements) {
        await client.execute(stmt);
      }
    }
  };

  return dbInstance;
};
