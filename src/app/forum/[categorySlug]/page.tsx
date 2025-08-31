// src/app/forum/[categorySlug]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import SearchByTitle from "@/components/SearchByTitle";
import TagFilter from "@/components/TagFilter";
import { BookmarkButton } from "@/components/BookmarkButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import SortControls from "@/components/SortControls";
import { formatTimeAgo } from '@/lib/timeUtils';
import Notification from '@/components/Notification';

// A function to get the details of a specific category by its name
async function getCategory(slug: string) {
  const categoryName = decodeURIComponent(slug).replace(/-/g, " ");
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .ilike("name", categoryName)
    .single();
  if (error || !data) return null;
  return data;
}

// A function to fetch all available tags
async function getTags() {
  const { data, error } = await supabase.from("tags").select("id, name");
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
  return data;
}

// A function to get threads
async function getThreads(
  categoryId: number,
  tags?: string[],
  search?: string,
  sort?: string
) {

  let query = supabase
    .from("threads_with_details")
    .select("*")
    .eq("category_id", categoryId);

  // Apply filters
  if (tags && tags.length > 0) {
    query = query.contains("tags", tags);
  }
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  // Apply sorting based on the 'sort' parameter
  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "most-liked":
      query = query.order("like_count", { ascending: false });
      break;
    default: // Default to 'newest'
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching threads:", error);
    return [];
  }
  return data;
}

// A function to fetch a user's bookmarked thread IDs
async function getUserBookmarks(userId: string) {
  if (!userId) return new Set();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("thread_id")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching bookmarks:", error);
    return new Set();
  }
  return new Set(data.map((bookmark) => bookmark.thread_id));
}

async function getUserLikes(userId: string) {
  if (!userId) return new Set();
  const { data, error } = await supabase
    .from("likes")
    .select("thread_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user likes:", error);
    return new Set();
  }
  return new Set(data.map((like) => like.thread_id));
}

// The main page component
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams?: Promise<{ tags?: string; search?: string; sort?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const bookmarkedThreadIds = session?.user
    ? await getUserBookmarks(session.user.id)
    : new Set();
  const likedThreadIds = session?.user
    ? await getUserLikes(session.user.id)
    : new Set();

  const { categorySlug } = await params;
  const search = await searchParams;
  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const tagsFilter = search?.tags?.split(",");
  const searchFilter = search?.search;
  const sortFilter = search?.sort;

  const threads = await getThreads(category.id, tagsFilter, searchFilter, sortFilter);
  const allTags = await getTags();

  return (
    <div className="container mx-auto p-8">
      <Notification />
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

      <SearchByTitle />
      {category.name.toLowerCase() === "marketplace" && (
        <TagFilter tags={allTags} />
      )}

      <SortControls />

      <div className="space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => {
            // For each thread, check if its ID is in our bookmarks set
            const isBookmarked = bookmarkedThreadIds.has(thread.id);
            const isLiked = likedThreadIds.has(thread.id);
            return (
              <Link
                href={`/forum/threads/${thread.id}`}
                key={thread.id}
                className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">{thread.title}</h2>
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
                      {thread.author_name} •{" "}
                      <span>
                       {formatTimeAgo(thread.created_at)}
                      </span>
                    </span>
                  </span>
                  <div className="flex items-center gap-4">
                    <LikeButton
                      threadId={thread.id}
                      likeCount={thread.like_count}
                      isInitiallyLiked={isLiked}
                    />
                    {/* Pass the new prop to the button */}
                    <BookmarkButton
                      threadId={thread.id}
                      isInitiallyBookmarked={isBookmarked}
                    />
                    <span className="font-medium text-gray-800">
                      {thread.reply_count}{" "}
                      {thread.reply_count === 1 ? "Reply" : "Replies"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p>No threads found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
}
