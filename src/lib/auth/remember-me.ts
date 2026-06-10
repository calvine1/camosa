export const REMEMBER_ME_COOKIE = "camosa-remember-me";
export const REMEMBER_ME_DAYS = 7;
export const REMEMBER_ME_MAX_AGE = REMEMBER_ME_DAYS * 24 * 60 * 60;

export function isRememberMeEnabled(cookieValue: string | undefined) {
  return cookieValue === "1";
}

/** Set remember-me preference before sign-in so storage + middleware use the same mode. */
export function setRememberMePreference(remember: boolean) {
  if (typeof document === "undefined") return;

  const value = remember ? "1" : "0";
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  if (remember) {
    document.cookie = `${REMEMBER_ME_COOKIE}=${value}; path=/; max-age=${REMEMBER_ME_MAX_AGE}; SameSite=Lax${secure}`;
  } else {
    document.cookie = `${REMEMBER_ME_COOKIE}=${value}; path=/; SameSite=Lax${secure}`;
  }
}

export function readRememberMePreference(): boolean {
  if (typeof document === "undefined") return true;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${REMEMBER_ME_COOKIE}=`));

  if (!match) return true;
  return isRememberMeEnabled(match.split("=")[1]);
}

export function getRememberMeFromRequest(
  getCookie: (name: string) => string | undefined
) {
  return isRememberMeEnabled(getCookie(REMEMBER_ME_COOKIE));
}

export function withRememberMeCookieOptions(
  remember: boolean,
  options: Record<string, unknown> = {}
) {
  if (!remember) {
    return options;
  }

  return {
    ...options,
    maxAge: REMEMBER_ME_MAX_AGE,
  };
}
