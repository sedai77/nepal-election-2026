"use client";

import Script from "next/script";

export default function FacebookSDK() {
  return (
    <Script
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== "undefined" && window.FB) {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
            cookie: true,
            xfbml: false,
            version: "v19.0",
          });
        }
      }}
    />
  );
}
