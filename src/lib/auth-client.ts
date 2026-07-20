"use client";

import { createAuthClient } from "better-auth/react";

/** Browser auth client. Same-origin; base URL inferred from the current page. */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
