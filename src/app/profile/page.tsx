// src/app/profile/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Image from "next/image";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";

// This new version fetches ALL details for each bookmarked thread
async function getBookmarkedThreads(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      threads_with_details ( * )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); // Show newest bookmarks first
  
  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
  return data.map(item => item.threads_with_details).flat().filter(Boolean);
}


// It fetches all the threads a user has liked
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

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const bookmarkedThreads = await getBookmarkedThreads(session.user.id);
  const likedThreadIds = await getUserLikes(session.user.id);

  return (
    <div className="container mx-auto p-8">
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
          <h1 className="text-4xl font-bold">Welcome, {session.user?.name}!</h1>
          <p className="text-gray-600">Your email is: {session.user?.email}</p>
        </div>
      </div>

<div>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Your Bookmarked Posts</h2>
        {/*Bookmarks*/}
        <div className="space-y-4">
          {bookmarkedThreads && bookmarkedThreads.length > 0 ? (
            bookmarkedThreads.map((thread) => {
              
               const isLiked = likedThreadIds.has(thread.id);

              return(
              <Link
                href={`/forum/threads/${thread.id}`}
                key={thread.id}
                className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-semibold mb-2">{thread.title}</h2>
                  <span className="flex-shrink-0 ml-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                    {thread.category_name}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{thread.content.substring(0, 150)}...</p>

                {thread.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.map((tag: string) => (
                      <span key={tag} className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
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
                    <LikeButton threadId={thread.id} likeCount={thread.like_count} isInitiallyLiked={isLiked}/>
                    {/* The bookmark button here will be filled, allowing users to un-bookmark */}
                    <BookmarkButton threadId={thread.id} isInitiallyBookmarked={true} />
                    <span className="font-medium text-gray-800">
                      {thread.reply_count}{" "}
                      {thread.reply_count === 1 ? "Reply" : "Replies"}
                    </span>
                  </div>
                </div>
              </Link>
            )})
          ) : (
            <p className="text-gray-500">You haven&apos;t bookmarked any posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}