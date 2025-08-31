// src/components/NewThreadForm.tsx
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
        // We get the current value of the hidden tags input
        const form = event.currentTarget;
        const tagsInput = form.elements.namedItem('tags') as HTMLInputElement;
        const tags = tagsInput.value;

        // If it's a marketplace post and tags are empty, stop the submission
        if (isMarketplaceSelected && (!tags || tags.trim() === '')) {
          event.preventDefault(); // This stops the form from being sent to the server
          setError("Marketplace posts require at least one tag.");
        } else {
          setError(null); // Clear any previous errors
        }
      }}
      className="space-y-6"
    >
      <input type="hidden" name="categorySlug" value={preselectedCategorySlug} />
      
      {/* Title, Content, and Category fields will keep their values because the page won't reload */}
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" required className="mt-1 block w-full ..." />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea name="content" id="content" required rows={6} className="mt-1 block w-full ..." />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select name="categoryId" id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full ...">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
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