"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SearchBlog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("query") as string;

    if (query) {
      router.push(`/blog?query=${encodeURIComponent(query)}`);
    } else {
      router.push(`/blog`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
        Search Blog Posts
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="query"
          id="search"
          defaultValue={searchParams.get("query") || ""}
          className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Nintendo 64"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Search
        </button>
      </div>
    </form>
  );
}