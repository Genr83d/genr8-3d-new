import type { IdTokenResult, User } from "firebase/auth";

const configuredAdmins = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((item: string) => item.trim().toLowerCase())
  .filter(Boolean);

export function isAdminUser(user: User | null, tokenResult: IdTokenResult | null): boolean {
  if (!user) {
    return false;
  }

  const hasClaim = tokenResult?.claims?.admin === true;
  if (hasClaim) {
    return true;
  }

  if (!user.email) {
    return false;
  }

  return configuredAdmins.includes(user.email.toLowerCase());
}
