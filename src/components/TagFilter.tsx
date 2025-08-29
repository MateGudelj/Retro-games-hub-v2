// src/components/TagFilter.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";

type Tag = {
  id: number;
  name: string;
};

export default function TagFilter({ tags }: { tags: Tag[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [tagSearch, setTagSearch] = useState('');

  const activeTags = searchParams.get("tags")?.split(',') || [];

  function handleTagClick(tagName: string) {
    const params = new URLSearchParams(searchParams.toString());
    let newTags = [...activeTags];

    if (newTags.includes(tagName)) {
      newTags = newTags.filter((t) => t !== tagName);
    } else {
      newTags.push(tagName);
    }

    if (newTags.length > 0) {
      params.set("tags", newTags.join(','));
    } else {
      params.delete("tags");
    }
    setTagSearch(''); 
    router.replace(`${pathname}?${params.toString()}`);
  }

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-2 mb-8">
      <label htmlFor="tag-search" className="block text-sm font-medium text-gray-700">
        Filter by Tag
      </label>
      <input
        type="text"
        id="tag-search"
        value={tagSearch}
        onChange={(e) => setTagSearch(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        placeholder="Search tags..."
      />
      <div className="flex items-center gap-2 overflow-x-auto py-2 [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_95%,rgba(0,0,0,0))]">
        {filteredTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            className={`flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
              activeTags.includes(tag.name)
                ? "bg-indigo-600 text-white"
                : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}