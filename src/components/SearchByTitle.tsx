// src/components/SearchByTitle.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react"; // Import useState and useEffect

export default function SearchByTitle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // 1. We create state to hold the input's current value
  const [inputValue, setInputValue] = useState(searchParams.get("search") || "");

  // 2. This is the debouncing effect
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set a timer to run after 500ms
    const timeoutId = setTimeout(() => {
      if (inputValue) {
        params.set("search", inputValue);
      } else {
        params.delete("search");
      }
      
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 500); // Wait for 500ms of inactivity before searching

    // This cleanup function runs if the user types again before 500ms is up
    return () => clearTimeout(timeoutId);

  }, [inputValue, pathname, router, searchParams, startTransition]);


  return (
    // We remove the onChange from the form and handle it on the input
    <form onSubmit={(e) => e.preventDefault()} className="mb-8">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
        Search by Title
      </label>
      <input
        type="text"
        name="search"
        id="search"
        disabled={isPending}
        value={inputValue} // The input value is now controlled by our state
        onChange={(e) => setInputValue(e.target.value)} // Update the state on every keystroke
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        placeholder="e.g., Zelda Ocarina of Time"
      />
    </form>
  );
}