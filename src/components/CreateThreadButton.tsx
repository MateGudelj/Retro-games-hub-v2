
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

// It receives the category name as a prop to build the correct URL
export default function CreateThreadButton({ categoryName }: { categoryName: string }) {
  const { data: session } = useSession();

  // We build the destination URL for the form page
  const newThreadUrl = `/forum/new-thread?category=${encodeURIComponent(categoryName)}`;

  return (
    <Link 
      // If the user is logged in, the link goes to the form page.
      // If not, it goes to the sign-in page, but tells it to come back here after.
      href={session ? newThreadUrl : `/api/auth/signin?callbackUrl=${encodeURIComponent(newThreadUrl)}`}
      className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all duration-300"
    >
      Create New Thread
    </Link>
  );
}