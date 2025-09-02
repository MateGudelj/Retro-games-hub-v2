
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image"; 

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // A subtle loading state to prevent layout shift
    return <div className="w-24 h-10"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => signOut()}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg"
        >
          Sign Out
        </button>

        <Link href="/profile" className="flex-shrink-0">
          {session.user?.image ? (
            // If the user has a profile picture, display it
            <Image
              src={session.user.image}
              alt={session.user.name || "Profile Picture"}
              className="rounded-full"
              width={40}
              height={40}
              title="View Profile"
            />
          ) : (
            // Fallback for users without an image: show their first initial
            <div 
              className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg"
              title="View Profile"
            >
              <span>{session.user?.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </Link>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
    >
      Sign In with Google
    </button>
  );
}