import { neon } from "@neondatabase/serverless";

const connectionString = process.env.STORAGE_DATABASE_URL || process.env.STORAGE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn("No database connection string found. Database features will not work.");
}

export const sql = neon(connectionString || "");

/**
 * Initialize database tables. Call once after first deploy.
 */
export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      fb_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      photo_url TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      last_login_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      fb_user_id TEXT NOT NULL REFERENCES users(fb_id),
      district TEXT NOT NULL,
      zone INTEGER NOT NULL,
      candidate_name TEXT NOT NULL,
      party TEXT NOT NULL,
      party_short TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(fb_user_id, district, zone)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS like_counts (
      id TEXT PRIMARY KEY,
      district TEXT NOT NULL,
      zone INTEGER NOT NULL,
      candidate_name TEXT NOT NULL,
      party TEXT NOT NULL,
      party_short TEXT NOT NULL,
      count INTEGER DEFAULT 0
    )
  `;

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_likes_district ON likes(district)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(fb_user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_like_counts_district ON like_counts(district)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_like_counts_top ON like_counts(count DESC)`;
}
