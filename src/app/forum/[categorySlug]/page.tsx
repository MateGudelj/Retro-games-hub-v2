import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import FilterControls from '@/components/FilterControls';

// A function to get the details of a specific category by its name
async function getCategory(slug: string) {
  // We replace hyphens with spaces for the lookup (e.g., "general-discussion" -> "General Discussion")
  const categoryName = decodeURIComponent(slug).replace(/-/g, " ");

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .ilike("name", categoryName) // Find the category where the name matches
    .single(); // We expect only one result

  if (error || !data) {
    return null;
  }
  return data;
}

async function getTags() {
  const { data, error } = await supabase.from('tags').select('id, name');
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
  return data;
}

// A function to get threads belonging to a category ID
async function getThreads(categoryId: number, tag?: string, search?: string) {
  // Start building the query
  let query = supabase
    .from('threads_with_details')
    .select('*')
    .eq('category_id', categoryId);

  // If a tag filter is provided, filter by threads that contain that tag
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // If a search query is provided, filter by title
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching threads:", error);
    return [];
  }
  return data;
}


export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>; // Type params as a Promise
  searchParams?: Promise<{ tag?: string; search?: string }>; // Type searchParams as a Promise
}) {
  // Await both promises to get their values
  const { categorySlug } = await params;
  const search = await searchParams;

  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }
  
  // Use the resolved values
  const tagFilter = search?.tag;
  const searchFilter = search?.search;

  // Pass the filters to getThreads
  const threads = await getThreads(category.id, tagFilter, searchFilter);
  // Fetch all tags to pass to the filter controls
  const allTags = await getTags();

  // const threads = await getThreads(category.id); old

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">Discussion threads in this category.</p>
      <div className="mb-6">
        <Link
          href={`/forum/new-thread?category=${encodeURIComponent(
            category.name
          )}`}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Create New Thread
        </Link>
      </div>
{/* If the category is Marketplace, show the filter controls */}
      {category.name.toLowerCase() === 'marketplace' && <FilterControls tags={allTags} />}

      <div className="space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <Link
              href={`/forum/threads/${thread.id}`}
              key={thread.id}
              className="block border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold">{thread.title}</h2>
              {/* We are not displaying the full content in the list anymore */}
              {/* <p className="text-gray-700 mt-2">{thread.content}</p> */}
              <p className="text-gray-600 mb-4 text-sm">
                {thread.content.substring(0, 150)}...
              </p>

              {thread.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {thread.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                <span>
                  Posted by:{" "}
                  <span className="font-medium text-gray-800">
                    {thread.author_name}
                  </span>
                </span>

                <div className="flex items-center gap-4">
                  <LikeButton
                    threadId={thread.id}
                    likeCount={thread.like_count}
                  />
                  <span>
                    {new Date(thread.created_at).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-gray-800">
                    {thread.reply_count}{" "}
                    {thread.reply_count === 1 ? "Reply" : "Replies"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>
            No threads in this category yet. Be the first to start a discussion!
          </p>
        )}
      </div>
    </div>
  );
}
