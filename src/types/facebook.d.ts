/* eslint-disable @typescript-eslint/no-explicit-any */

interface FacebookLoginStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  };
}

interface FacebookLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  };
}

interface FacebookSDK {
  init(params: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }): void;
  login(
    callback: (response: FacebookLoginResponse) => void | Promise<void>,
    options?: { scope?: string; return_scopes?: boolean }
  ): void;
  logout(callback?: (response: any) => void): void;
  getLoginStatus(
    callback: (response: FacebookLoginStatusResponse) => void,
    force?: boolean
  ): void;
  api(
    path: string,
    callback: (response: any) => void
  ): void;
  api(
    path: string,
    method: string,
    callback: (response: any) => void
  ): void;
  api(
    path: string,
    method: string,
    params: Record<string, any>,
    callback: (response: any) => void
  ): void;
}

interface Window {
  FB?: FacebookSDK;
  fbAsyncInit?: () => void;
}
