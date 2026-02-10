import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ district: string }> }
) {
  try {
    const { district } = await params;
    const districtUpper = district.toUpperCase();

    // Get like counts for this district
    const counts = await sql`
      SELECT zone, candidate_name, party, party_short, count
      FROM like_counts
      WHERE district = ${districtUpper} AND count > 0
      ORDER BY zone, count DESC
    `;

    // Check if user is logged in and get their likes
    const fbUserId = request.nextUrl.searchParams.get("userId");
    let userLikes: Record<number, string> = {};

    if (fbUserId) {
      const userLikeRows = await sql`
        SELECT zone, candidate_name
        FROM likes
        WHERE fb_user_id = ${fbUserId} AND district = ${districtUpper}
      `;
      for (const row of userLikeRows) {
        userLikes[row.zone] = row.candidate_name;
      }
    }

    // Structure: { counts: { [zone]: { [candidateName]: { count, party, partyShort } } }, userLikes: { [zone]: candidateName } }
    const countsByZone: Record<number, Record<string, { count: number; party: string; partyShort: string }>> = {};
    for (const row of counts) {
      if (!countsByZone[row.zone]) countsByZone[row.zone] = {};
      countsByZone[row.zone][row.candidate_name] = {
        count: row.count,
        party: row.party,
        partyShort: row.party_short,
      };
    }

    return NextResponse.json(
      { counts: countsByZone, userLikes },
      { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } }
    );
  } catch (error) {
    console.error("Get likes error:", error);
    return NextResponse.json({ error: "Failed to get likes" }, { status: 500 });
  }
}
