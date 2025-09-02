
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
import { formatTimeAgo } from "@/lib/timeUtils";
import Notification from "@/components/Notification";
import CreateThreadButton from '@/components/CreateThreadButton';

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
    case "price-asc":
      // Sort by price ascending, putting items with no price at the end
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price-desc":
      // Sort by price descending, putting items with no price at the end
      query = query.order("price", { ascending: false, nullsFirst: false });
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

  const isMarketplace = category.name.toLowerCase() === "marketplace";

  const threads = await getThreads(
    category.id,
    tagsFilter,
    searchFilter,
    sortFilter
  );
  const allTags = await getTags();

  return (
    <div className="container max-w-5xl mx-auto p-8">
      <Notification />
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">Discussion threads in this category.</p>

      <div className="mb-6">
  <CreateThreadButton categoryName={category.name} />
</div>

      <SearchByTitle />
      {isMarketplace && <TagFilter tags={allTags} />}

      <SortControls isMarketplace={isMarketplace} />

      <div className="space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => {
            const isBookmarked = bookmarkedThreadIds.has(thread.id);
            const isLiked = likedThreadIds.has(thread.id);

            return (
              <Link
                href={`/forum/threads/${thread.id}`}
                key={thread.id}
                className="block border rounded-lg p-6 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-600 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2 items-start">
                  <h2 className="text-2xl font-semibold text-slate-100 break-words min-w-0">
  {thread.title.substring(0, 100)}
</h2>
                  {thread.category_name === "Marketplace" && thread.price && (
                    <span className="flex-shrink-0 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
                      ${thread.price}
                    </span>
                  )}
                </div>
                
                <p className="text-slate-400 mb-4 text-sm break-words">
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

                
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 mt-4 pt-4 border-t border-slate-700 gap-4">
  
  {/* 1. Author and Timestamp */}
  <div className="flex-shrink-0">
    <span className="hidden sm:inline">Posted by: </span>
    <span className="font-medium text-slate-300">{thread.author_name}</span> • <span>{formatTimeAgo(thread.created_at)}</span>
  </div>

  {/* 2. Interactions */}
  <div className="flex items-center justify-between w-full sm:w-auto">
    {/* This version of Reply Count is ONLY visible on mobile */}
    <span className="font-medium text-slate-300 sm:hidden">
      {thread.reply_count}{" "}
      {thread.reply_count === 1 ? "Reply" : "Replies"}
    </span>

    {/* This container groups the buttons and the desktop reply count */}
    <div className="flex items-center gap-4">
      <LikeButton
        threadId={thread.id}
        likeCount={thread.like_count}
        isInitiallyLiked={isLiked}
      />
      <BookmarkButton
        threadId={thread.id}
        isInitiallyBookmarked={isBookmarked}
      />
      {/* This version of Reply Count is HIDDEN on mobile and visible on desktop */}
      <span className="font-medium text-slate-300 hidden sm:inline-block">
        {thread.reply_count}{" "}
        {thread.reply_count === 1 ? "Reply" : "Replies"}
      </span>
    </div>
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
