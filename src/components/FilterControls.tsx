// src/components/FilterControls.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";

type Tag = {
  id: number;
  name: string;
};

export default function FilterControls({ tags }: { tags: Tag[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [tagSearch, setTagSearch] = useState('');

  const activeTag = searchParams.get("tag");

  function handleFilter(formData: FormData) {
    const searchQuery = formData.get("search") as string;
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleTagClick(tagName: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tagName === activeTag) {
      params.delete("tag");
    } else {
      params.set("tag", tagName);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    // This is the main container. We've removed the border and background color.
    <div className="space-y-4 mb-8">
      {/* Search by Title Form */}
      <form onChange={(e) => handleFilter(new FormData(e.currentTarget))}>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search by Title
        </label>
        <input
          type="text"
          name="search"
          id="search"
          defaultValue={searchParams.get("search") || ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Zelda Ocarina of Time"
        />
      </form>

      {/* Tag Filter Section */}
      <div className="space-y-2">
        <label htmlFor="tag-search" className="block text-sm font-medium text-gray-700">
          Filter by Tag
        </label>
        
        <input
          type="text"
          id="tag-search"
          value={tagSearch}
          disabled={isPending}
          onChange={(e) => setTagSearch(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search tags..."
        />

        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.name)}
              className={`flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                activeTag === tag.name
                  ? "bg-indigo-600 text-white"
                  // Reverted to the old, simpler style for inactive tags
                  : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}