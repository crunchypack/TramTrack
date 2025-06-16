"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Signed in as {session.user?.email}</span>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
    >
      Sign in with Google
    </button>
  );
}
