import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

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

// A function to get all threads belonging to a category ID
async function getThreads(categoryId: number) {
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .eq("category_id", categoryId); // Filter threads by the category ID

  if (error) {
    console.error("Error fetching threads:", error);
    return [];
  }
  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    notFound(); // If the category doesn't exist, show a 404 page
  }

  const threads = await getThreads(category.id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">Discussion threads in this category.</p>
      <div className="mb-6">
        <Link
          href="/forum/new-thread"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Create New Thread
        </Link>
      </div>
      <div className="space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div
              key={thread.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* We'll make this a real link on the next day */}
              <h2 className="text-2xl font-semibold">{thread.title}</h2>
              <p className="text-gray-700 mt-2">{thread.content}</p>
              <p className="text-sm text-gray-500 mt-4">
                Posted on: {new Date(thread.created_at).toLocaleDateString()}
              </p>
            </div>
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
