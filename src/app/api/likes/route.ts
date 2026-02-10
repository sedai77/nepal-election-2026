import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyFacebookToken } from "@/lib/verifyFacebookToken";
import { getDistrictData } from "@/data/electionData";

// Simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
function checkRate(userId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateMap.set(userId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, district, zone, candidateName, party, partyShort } = body;

    // Validate required fields
    if (!accessToken || !district || !zone || !candidateName || !party || !partyShort) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify Facebook token
    const fbUser = await verifyFacebookToken(accessToken);
    if (!fbUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Rate limit
    if (!checkRate(fbUser.fbId)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Validate district/zone/candidate exist in static data
    const districtUpper = district.toUpperCase();
    const districtData = getDistrictData(districtUpper);
    if (!districtData) {
      return NextResponse.json({ error: "Invalid district" }, { status: 400 });
    }
    const zoneData = districtData.zones.find((z) => z.zone === zone);
    if (!zoneData) {
      return NextResponse.json({ error: "Invalid zone" }, { status: 400 });
    }
    const candidateExists = zoneData.candidates.some((c) => c.name === candidateName);
    if (!candidateExists) {
      return NextResponse.json({ error: "Invalid candidate" }, { status: 400 });
    }

    const likeId = `${fbUser.fbId}_${districtUpper}_${zone}`;
    const countId = (name: string) =>
      `${districtUpper}_${zone}_${name.replace(/[^a-zA-Z0-9 ]/g, "")}`;

    // Check if user already has a like for this zone
    const existing = await sql`
      SELECT candidate_name, party, party_short FROM likes WHERE id = ${likeId}
    `;

    if (existing.length > 0) {
      const oldCandidate = existing[0].candidate_name;
      const oldCountId = countId(oldCandidate);

      if (oldCandidate === candidateName) {
        // Already liked this candidate — remove the like (toggle off)
        await sql`DELETE FROM likes WHERE id = ${likeId}`;
        await sql`
          UPDATE like_counts SET count = GREATEST(count - 1, 0) WHERE id = ${oldCountId}
        `;
        return NextResponse.json({ action: "removed" });
      }

      // Change vote: decrement old, increment new
      const newCountId = countId(candidateName);

      // Decrement old
      await sql`
        UPDATE like_counts SET count = GREATEST(count - 1, 0) WHERE id = ${oldCountId}
      `;

      // Upsert new count
      await sql`
        INSERT INTO like_counts (id, district, zone, candidate_name, party, party_short, count)
        VALUES (${newCountId}, ${districtUpper}, ${zone}, ${candidateName}, ${party}, ${partyShort}, 1)
        ON CONFLICT (id) DO UPDATE SET count = like_counts.count + 1
      `;

      // Update the like record
      await sql`
        UPDATE likes SET
          candidate_name = ${candidateName},
          party = ${party},
          party_short = ${partyShort},
          updated_at = NOW()
        WHERE id = ${likeId}
      `;

      return NextResponse.json({ action: "changed" });
    }

    // New like
    const newCountId = countId(candidateName);

    await sql`
      INSERT INTO likes (id, fb_user_id, district, zone, candidate_name, party, party_short)
      VALUES (${likeId}, ${fbUser.fbId}, ${districtUpper}, ${zone}, ${candidateName}, ${party}, ${partyShort})
    `;

    await sql`
      INSERT INTO like_counts (id, district, zone, candidate_name, party, party_short, count)
      VALUES (${newCountId}, ${districtUpper}, ${zone}, ${candidateName}, ${party}, ${partyShort}, 1)
      ON CONFLICT (id) DO UPDATE SET count = like_counts.count + 1
    `;

    return NextResponse.json({ action: "liked" });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
  }
}
