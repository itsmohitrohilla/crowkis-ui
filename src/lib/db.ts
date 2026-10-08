type Query = <R = Record<string, unknown>>(text: string, values?: unknown[]) => Promise<R[]>;

// ponytail: one short-lived connection per call, fine at marketing-site volume.
// Switch to a pooled client if event traffic grows.
export async function withDb<T>(fn: (query: Query) => Promise<T>): Promise<T> {
  const raw = process.env.SUPABASE_DB_URL;
  if (!raw) throw new Error("database not configured");
  const { default: pg } = await import("pg");
  const client = new pg.Client({
    connectionString: raw.split("?")[0],
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    return await fn(async <R,>(text: string, values: unknown[] = []) => {
      const res = await client.query(text, values);
      return res.rows as R[];
    });
  } finally {
    await client.end();
  }
}
