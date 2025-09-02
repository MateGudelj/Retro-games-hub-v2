
"use client";

import { useState, useMemo } from "react";
import { createThread } from "@/app/actions";
import TagInput from './TagInput';

type Category = { id: number; name: string; };
type Tag = { id: number; name: string; };

export default function NewThreadForm({ 
  categories, 
  allTags,
  preselectedCategoryName,
  preselectedCategorySlug
}: { 
  categories: Category[],
  allTags: Tag[],
  preselectedCategoryName?: string,
  preselectedCategorySlug?: string
}) {
  const [categoryId, setCategoryId] = useState(
    categories.find(cat => cat.name === preselectedCategoryName)?.id.toString() || categories[0]?.id.toString() || ''
  );
  
  // State to hold our validation error message
  const [error, setError] = useState<string | null>(null);

  const marketplaceCategoryId = useMemo(
    () => categories.find(cat => cat.name.toLowerCase() === 'marketplace')?.id,
    [categories]
  );
  
  const isMarketplaceSelected = marketplaceCategoryId !== undefined && Number(categoryId) === marketplaceCategoryId;

  return (
    // We add an onSubmit handler to the form
    <form 
      action={createThread} 
      // This is the key change. We run our own check before the server action.
      onSubmit={(event) => {
      // We only run the tag validation if the marketplace is selected.
        if (isMarketplaceSelected) {
          const form = event.currentTarget;
          const tagsInput = form.elements.namedItem('tags') as HTMLInputElement;
          const tags = tagsInput ? tagsInput.value : '';

          if (!tags || tags.trim() === '') {
            event.preventDefault(); // Stop the form submission
            setError("Marketplace posts require at least one tag.");
          } else {
            setError(null);
          }
        } else {
          // For all other categories, clear any old errors.
          setError(null);
        }
      }}
      className="space-y-6"
    >
      <input type="hidden" name="categorySlug" value={preselectedCategorySlug} />
      

      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" required className="mt-1 border focus:outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea name="content" id="content" required rows={6} className="mt-1 border focus:outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
      </div>
      {isMarketplaceSelected && (
    <div>
      <label htmlFor="price" className="">
        Price ($)
      </label>
      <input
      required
        type="number"
        name="price"
        id="price"
        step="0.01" // Allows decimal values like 25.50
        placeholder="e.g., 25.50"
        className="mt-1 border focus:outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      />
    </div>
  )}
      <div>
  <label htmlFor="category" className="block text-sm font-medium text-slate-300">
    Category
  </label>

  <div className="relative mt-1">
    <select
      name="categoryId"
      id="category"
      value={categoryId}
      onChange={(e) => setCategoryId(e.target.value)}

      className="appearance-none block w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 pl-3 pr-10"
    >
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
    {/* This is our custom arrow icon */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>
      
      {isMarketplaceSelected && <TagInput allTags={allTags}/>}

      {/* Display the error message if it exists */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
        Create Thread
      </button>
    </form>
  );
}