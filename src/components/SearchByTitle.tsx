
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function SearchByTitle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // This function now runs only when the form is submitted
  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent a full page reload
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search") as string;
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    // Replace the URL to trigger a new search
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    // The form now uses onSubmit to trigger the search
    <form onSubmit={handleSearch} className="mb-8">
      <label htmlFor="search" className="block text-sm font-medium text-slate-300">
        Search by Title
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          defaultValue={searchParams.get("search") || ""}
          className="block w-full flex-1 rounded-none rounded-l-lg border border-slate-600  text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-600 transition-all duration-300 sm:text-sm p-2"
          placeholder="e.g., Zelda Ocarina of Time"
        />
        {/* The search button is now required */}
        <button
          type="submit"
          className="inline-flex items-center rounded-r-lg border border-l-0 border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all duration-300"
        >
          Search
        </button>
      </div>
    </form>
  );
}