
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { formatTimeAgo } from "@/lib/timeUtils";

// This function fetches ALL details for each bookmarked thread
async function getBookmarkedThreads(userId: string) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      threads_with_details ( * )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
  return data
    .map((item) => item.threads_with_details)
    .flat()
    .filter(Boolean);
}

// This function fetches all the threads a user has liked
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

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const bookmarkedThreads = await getBookmarkedThreads(session.user.id);
  const likedThreadIds = await getUserLikes(session.user.id);

  return (
    <div className="container max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Profile Picture"
            className="rounded-full"
            width={96}
            height={96}
          />
        )}
        <div>
          <h1 className="text-4xl font-bold text-slate-100">Welcome, {session.user?.name}!</h1>
          <p className="text-slate-400">Your email is: {session.user?.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold border-b border-slate-700 text-slate-100 pb-2 mb-4">
          Your Bookmarked Posts
        </h2>
        {/* The list of bookmarked threads */}
        <div className="space-y-4">
          {bookmarkedThreads && bookmarkedThreads.length > 0 ? (
            bookmarkedThreads.map((thread) => {
              const isLiked = likedThreadIds.has(thread.id);

              return (
                <Link
                  href={`/forum/threads/${thread.id}`}
                  key={thread.id}
                  className="block border rounded-lg p-6 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-600 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2 items-start">
                    <h2 className="text-2xl font-semibold text-slate-100 break-words min-w-0">
  {thread.title}
</h2>
                    {/* Conditionally render price OR category name */}
                    {thread.category_name === 'Marketplace' && thread.price ? (
                      <span className="flex-shrink-0 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
                        ${thread.price}
                      </span>
                    ) : (
                      <span className="flex-shrink-0 inline-block rounded-full bg-slate-700 px-3 py-1 text-sm font-semibold text-slate-300">
                        {thread.category_name}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-400 mb-4 text-sm break-words">
                    {thread.content.substring(0, 150)}...
                  </p>

                  {thread.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {thread.tags.map((tag: string) => (
                        <span key={tag} className="inline-block rounded-full bg-indigo-200 text-indigo-800 px-3 py-1 text-sm font-semibold">
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
        isInitiallyBookmarked={true}
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
            <p className="text-slate-500">
              You haven&apos;t bookmarked any posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}