import { headers } from "next/headers";

import {
  type AuthenticatedUser,
  getAuthenticatedUser,
} from "@/modules/identity-workspace";

/** Authenticated user for the current request, or null. */
export async function currentUser(): Promise<AuthenticatedUser | null> {
  return getAuthenticatedUser(await headers());
}
