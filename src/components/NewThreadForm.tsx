"use client";

import { useState, useMemo } from "react";
import { createThread } from "@/app/actions";
import TagInput from './TagInput';

type Category = {
  id: number;
  name: string;
};

type Tag = {
  id: number;
  name: string;
};


// The component now accepts a new optional prop
export default function NewThreadForm({  
  categories, 
  allTags,
  preselectedCategoryName 
}: { 
  categories: Category[],
  allTags: Tag[],
  preselectedCategoryName?: string 
}) {


  // Find the category object that matches the name from the URL
  const preselectedCategory = useMemo(
    () => categories.find(cat => cat.name === preselectedCategoryName),
    [categories, preselectedCategoryName]
  );

  // Set the initial state: if a pre-selected category was found, use its ID.
  // Otherwise, fall back to the first category in the list.
  const [categoryId, setCategoryId] = useState(
    preselectedCategory ? preselectedCategory.id.toString() : (categories[0]?.id.toString() || '')
  );


  const marketplaceCategoryId = useMemo(
    () => categories.find(cat => cat.name.toLowerCase() === 'marketplace')?.id,
    [categories]
  );

  const isMarketplaceSelected = marketplaceCategoryId !== undefined && Number(categoryId) === marketplaceCategoryId;

  return (
    <form action={createThread} className="space-y-6">
      {/* Title and Content inputs remain the same */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          name="content"
          id="content"
          required
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* The category dropdown will now use the new initial state */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="categoryId"
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isMarketplaceSelected && <TagInput allTags={allTags}/>}

      <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
        Create Thread
      </button>
    </form>
  );
}