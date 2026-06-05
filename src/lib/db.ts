import pg from "pg";

const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

let pool: pg.Pool;

if (process.env.NODE_ENV === "production") {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  if (!globalForDb.pool) {
    globalForDb.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  pool = globalForDb.pool;
}

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export { pool };
