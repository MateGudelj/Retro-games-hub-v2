// src/app/forum/threads/[threadId]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import ReplyForm from "@/components/ReplyForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { BookmarkButton } from "@/components/BookmarkButton";
import { formatTimeAgo } from "@/lib/timeUtils";
import Link from "next/link";
import Notification from "@/components/Notification";

// A function to get a single thread by its ID
async function getThread(threadId: string) {
  const { data, error } = await supabase
    .from("threads_with_details") // We use the view we created in the last step
    .select("*")
    .eq("id", threadId)
    .single();

  if (error) {
    console.error("Error fetching thread:", error);
    notFound();
  }
  return data;
}

// A function to get all replies for a thread
async function getReplies(threadId: string) {
  const { data, error } = await supabase
    .from("replies_with_author") // We use our new replies view
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true }); // Show oldest replies first

  if (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
  return data;
}

// It fetches all of a user's bookmarked thread IDs for quick lookups
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

  // A Set is used for very fast 'has()' checks
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

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const session = await getServerSession(authOptions);

  const { threadId } = await params;
  const thread = await getThread(threadId);
  const replies = await getReplies(threadId);

  // Fetch the user's bookmarks and likes and check if this thread is included
  const bookmarkedThreadIds = session?.user
    ? await getUserBookmarks(session.user.id)
    : new Set();
  const likedThreadIds = session?.user
    ? await getUserLikes(session.user.id)
    : new Set();
  const isBookmarked = bookmarkedThreadIds.has(thread.id);
  const isLiked = likedThreadIds.has(thread.id);

return (
    <div className="container max-w-5xl mx-auto p-4 md:p-8">
      <Notification />
      {/* --- Main Thread Post Card --- */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start items-start gap-2 sm:gap-4 mb-4">
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 break-words min-w-0">
            {thread.title}
          </h1>
          {thread.category_name === 'Marketplace' && thread.price && (
            <span className="flex-shrink-0 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
              ${thread.price}
            </span>
          )}
        </div>

        
        <p className="text-slate-300 leading-relaxed break-words">
          {thread.content}
        </p>

        {/* Tags Section  */}
        {thread.tags && thread.category_name === 'Marketplace' && (
           <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-slate-700">
            {thread.tags.map((tag: string) => (
              <span key={tag} className="inline-block rounded-full bg-indigo-200 text-indigo-800 px-3 py-1 text-sm font-semibold">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-500">
            
            <span className="hidden sm:inline">Posted by </span> 
            <span className="font-medium text-slate-300">{thread.author_name}</span> • {formatTimeAgo(thread.created_at)}
          </p>
          <div className="flex items-center gap-4">
            <LikeButton threadId={thread.id} likeCount={thread.like_count} isInitiallyLiked={isLiked} />
            <BookmarkButton threadId={thread.id} isInitiallyBookmarked={isBookmarked} />
          </div>
        </div>
      </div>

      {/* --- Replies Section --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-100 border-b border-slate-700 pb-2">
          {thread.reply_count} {thread.reply_count === 1 ? "Reply" : "Replies"}
        </h2>
        
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              
              <p className="text-slate-300 break-words">{reply.content}</p>
              <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-600">
                <span className="font-medium text-slate-300">{reply.author_name}</span> • {formatTimeAgo(reply.created_at)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No replies yet. Be the first to post!</p>
        )}
      </div>

{/* --- Reply Form Section --- */}
      <div className="mt-8 pt-8 border-t-2 border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-slate-100">Reply to the thread</h3>
        {session?.user ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <p className="text-slate-400">
            You must be <Link href="/api/auth/signin" className="text-blue-400 hover:underline">signed in</Link> to post a reply.
          </p>
        )}
      </div>
    </div>
  );
}