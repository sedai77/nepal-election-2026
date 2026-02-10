import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyFacebookToken } from "@/lib/verifyFacebookToken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 400 });
    }

    // Verify token with Facebook
    const fbUser = await verifyFacebookToken(accessToken);

    if (!fbUser) {
      return NextResponse.json({ error: "Invalid Facebook token" }, { status: 401 });
    }

    // Upsert user in database
    await sql`
      INSERT INTO users (fb_id, name, email, photo_url, created_at, last_login_at)
      VALUES (${fbUser.fbId}, ${fbUser.name}, ${fbUser.email}, ${fbUser.photoUrl}, NOW(), NOW())
      ON CONFLICT (fb_id) DO UPDATE SET
        name = ${fbUser.name},
        email = ${fbUser.email},
        photo_url = ${fbUser.photoUrl},
        last_login_at = NOW()
    `;

    return NextResponse.json({
      fbId: fbUser.fbId,
      name: fbUser.name,
      email: fbUser.email,
      photoUrl: fbUser.photoUrl,
    });
  } catch (error) {
    console.error("Facebook auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
