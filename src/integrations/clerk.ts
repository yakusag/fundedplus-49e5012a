// Clerk publishable key — safe to expose in client code.
// To set: paste your pk_test_... or pk_live_... key below.
export const CLERK_PUBLISHABLE_KEY =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY) ||
  "";

export const isClerkConfigured = Boolean(CLERK_PUBLISHABLE_KEY);
