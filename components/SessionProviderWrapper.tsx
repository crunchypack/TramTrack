"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
/**
 * Wrapper for sessionprovider to be used in layout
 */
export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
