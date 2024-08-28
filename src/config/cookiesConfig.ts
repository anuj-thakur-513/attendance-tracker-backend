export const AUTH_COOKIE_OPTIONS = {
  sameSite: "strict" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};
