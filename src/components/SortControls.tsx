
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function SortControls({ isMarketplace = false }: { isMarketplace?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
        <label htmlFor="sort" className="text-sm font-medium text-slate-300">
          Sort by:
        </label>
        
        {/* --- THIS IS THE STYLED DROPDOWN --- */}
        {/* We wrap it in a div to position our custom arrow */}
        <div className="relative">
          <select
            id="sort"
            name="sort"
            onChange={handleSortChange}
            defaultValue={currentSort}
            // 1. We remove the default browser appearance
            className="appearance-none rounded-md border border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 pl-3 pr-10"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-liked">Most Liked</option>
            {isMarketplace && (
              <>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </>
            )}
          </select>
          {/* 2. We add our own custom arrow icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}