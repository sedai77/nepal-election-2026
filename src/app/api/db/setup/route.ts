import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

/**
 * One-time database setup endpoint.
 * Call GET /api/db/setup after first deploy to create tables.
 */
export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: "Database tables created successfully" });
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
