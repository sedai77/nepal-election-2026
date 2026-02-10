import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { PARTY_COLORS } from "@/data/electionData";

export async function GET() {
  try {
    // Top 10 liked candidates
    const topCandidates = await sql`
      SELECT district, zone, candidate_name, party, party_short, count
      FROM like_counts
      WHERE count > 0
      ORDER BY count DESC
      LIMIT 10
    `;

    // District sentiment: aggregate likes by district -> party
    const sentimentRows = await sql`
      SELECT district, party, party_short, SUM(count) as total_likes
      FROM like_counts
      WHERE count > 0
      GROUP BY district, party, party_short
      ORDER BY district, total_likes DESC
    `;

    // Build sentiment map: for each district, pick party with most likes
    const districtPartyLikes: Record<string, { party: string; partyShort: string; totalLikes: number }[]> = {};
    for (const row of sentimentRows.rows) {
      if (!districtPartyLikes[row.district]) districtPartyLikes[row.district] = [];
      districtPartyLikes[row.district].push({
        party: row.party,
        partyShort: row.party_short,
        totalLikes: Number(row.total_likes),
      });
    }

    const sentiment: Record<string, { party: string; partyShort: string; color: string; totalLikes: number }> = {};
    for (const [district, parties] of Object.entries(districtPartyLikes)) {
      // Already sorted by total_likes DESC from SQL
      const top = parties[0];
      sentiment[district] = {
        party: top.party,
        partyShort: top.partyShort,
        color: PARTY_COLORS[top.party] || "#6b7280",
        totalLikes: top.totalLikes,
      };
    }

    // Total likes across all
    const totalResult = await sql`SELECT COALESCE(SUM(count), 0) as total FROM like_counts WHERE count > 0`;
    const totalLikes = Number(totalResult.rows[0]?.total || 0);

    return NextResponse.json(
      {
        topCandidates: topCandidates.rows,
        sentiment,
        totalLikes,
      },
      { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" } }
    );
  } catch (error) {
    console.error("Top likes error:", error);
    return NextResponse.json({ error: "Failed to get top likes" }, { status: 500 });
  }
}
