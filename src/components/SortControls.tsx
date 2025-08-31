// src/components/SortControls.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function SortControls() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the current sort order from the URL, defaulting to 'newest'
  const currentSort = searchParams.get("sort") || "newest";

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newSortOrder = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", newSortOrder);

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex justify-end">
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          name="sort"
          onChange={handleSortChange}
          defaultValue={currentSort}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-liked">Most Liked</option>
        </select>
      </div>
    </div>
  );
}