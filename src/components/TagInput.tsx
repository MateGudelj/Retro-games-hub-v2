// src/components/TagInput.tsx
"use client";

import { useState } from "react";

type Tag = {
  id: number;
  name: string;
};

interface TagInputProps {
  allTags: Tag[];
}

export default function TagInput({ allTags }: TagInputProps) {
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.some((selected) => selected.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagToRemove.id));
  };

  const filteredTags = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor="tag-search"
        className="block text-sm font-medium text-gray-700"
      >
        Tags
      </label>

      <input
        type="hidden"
        name="tags"
        value={selectedTags.map((tag) => tag.name).join(",")}
        required
      />

      <div className="flex flex-wrap items-center gap-2 p-2 min-h-[42px]">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-gray-400">No tags selected</span>
        ) : (
          selectedTags.map((tag) => (
            // --- CHANGE 1: Different color for selected tags ---
            <div
              key={tag.id}
              className="flex-shrink-0 flex items-center gap-1 bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded-full"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-600 hover:text-gray-800 font-bold"
              >
                &times;
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- CHANGE 2 & 3: Added padding to the input field --- */}
      <input
        type="text"
        id="tag-search"
        value={tagSearch}
        onChange={(e) => setTagSearch(e.target.value)}
        // here is important to put border to override default browser behaviour
        className="block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm p-2"
        placeholder="Search available tags to add..."
      />

      <div className="flex items-center gap-2 overflow-x-auto p-2 [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_95%,rgba(0,0,0,0))]">
        {" "}
        {filteredTags.map((tag) => (
          <button
            type="button"
            key={tag.id}
            onClick={() => handleSelectTag(tag)}
            className="flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full transition-colors bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
