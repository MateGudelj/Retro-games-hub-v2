"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
         <Link href="/profile" className="hover:underline">
        {session.user?.name}
      </Link>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")} // Tell NextAuth to use Google
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign In with Google
    </button>
  );
}