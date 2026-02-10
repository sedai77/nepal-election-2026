/**
 * Server-side Facebook access token verification.
 * Calls the Facebook Graph API to validate the token and fetch user info.
 */

export interface FacebookUserInfo {
  fbId: string;
  name: string;
  email: string;
  photoUrl: string;
}

export async function verifyFacebookToken(
  accessToken: string
): Promise<FacebookUserInfo | null> {
  try {
    // 1. Fetch user info from Graph API
    const userRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.width(100).height(100)&access_token=${accessToken}`
    );

    if (!userRes.ok) return null;
    const userData = await userRes.json();

    if (!userData.id) return null;

    // 2. Verify token belongs to our app via debug_token
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (appId && appSecret) {
      const debugRes = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`
      );
      const debugData = await debugRes.json();

      if (!debugData.data?.is_valid || debugData.data?.app_id !== appId) {
        return null;
      }
    }

    return {
      fbId: userData.id,
      name: userData.name || "",
      email: userData.email || "",
      photoUrl: userData.picture?.data?.url || "",
    };
  } catch {
    return null;
  }
}
