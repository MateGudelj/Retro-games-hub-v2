// src/app/forum/threads/[threadId]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import ReplyForm from "@/components/ReplyForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { BookmarkButton } from "@/components/BookmarkButton";

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
    .from('likes')
    .select('thread_id')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching user likes:", error);
    return new Set();
  }
  return new Set(data.map(like => like.thread_id));
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
  const likedThreadIds = session?.user ? await getUserLikes(session.user.id) : new Set();
  const isBookmarked = bookmarkedThreadIds.has(thread.id);
  const isLiked = likedThreadIds.has(thread.id);
  

  return (
    <div className="container mx-auto p-8">
      {/* Main Thread Post */}
      <div className="border-b-2 pb-6 mb-6">
        <h1 className="text-4xl font-bold mb-4">{thread.title}</h1>
        <p className="text-lg text-gray-700 mb-4">{thread.content}</p>
        {thread.tags && thread.category_name === "Marketplace" && (
          <div className="flex flex-wrap gap-2 pt-2 pb-4 mt-4 border-b">
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
        <p className="text-sm text-gray-500">
          Posted by {thread.author_name} on{" "}
          {new Date(thread.created_at).toLocaleDateString()} at{" "}
          {new Date(thread.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <LikeButton threadId={thread.id} likeCount={thread.like_count} isInitiallyLiked={isLiked}/>{" "}
        <BookmarkButton threadId={thread.id} isInitiallyBookmarked={isBookmarked} />
      </div>

      {/* Replies Section */}
      <div className="mt-8 pt-8 border-t-2">
        <h3 className="text-xl font-semibold mb-4">Post a Reply</h3>
        {session?.user ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <p className="text-gray-600">
            You must be{" "}
            <Link
              href="/api/auth/signin"
              className="text-indigo-600 hover:underline"
            >
              signed in
            </Link>{" "}
            to post a reply.
          </p>
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-4">Replies</h2>
      <div className="space-y-4">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className="border rounded-lg p-4 bg-gray-50">
              <p className="text-gray-800">{reply.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by {reply.author_name} on{" "}
                {new Date(reply.created_at).toLocaleDateString()} at{" "}
                {new Date(reply.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No replies yet.</p>
        )}
      </div>
    </div>
  );
}
