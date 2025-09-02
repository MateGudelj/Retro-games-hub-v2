
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function SearchBlog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // State to control the input's value
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");

  // This effect debounces the search
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set a timer to run after 300ms of inactivity
    const timeoutId = setTimeout(() => {
      if (inputValue) {
        params.set("query", inputValue);
      } else {
        params.delete("query");
      }
      
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 500); // 300ms delay

    // Cleanup: cancel the timer if the user types again
    return () => clearTimeout(timeoutId);

  }, [inputValue, pathname, router, searchParams, startTransition]);

  return (
    // The form now just prevents a full page reload on Enter
    <form onSubmit={(e) => e.preventDefault()} className="mb-8">
      <label htmlFor="search" className="block text-sm font-medium text-gray-100">
        Search Blog Posts
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="query"
          id="search"
          disabled={isPending}
          value={inputValue} // Use state to control the value
          onChange={(e) => setInputValue(e.target.value)} // Update state on every keystroke
          className="mt-1 border focus:outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 transition-all duration-300 sm:text-sm p-2"
          placeholder="e.g., Nintendo 64"
        />
      </div>
    </form>
  );
}