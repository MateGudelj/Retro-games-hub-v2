// src/app/forum/threads/[threadId]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import LikeButton from '@/components/LikeButton';

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

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThread(threadId);
  const replies = await getReplies(threadId);

  return (
    <div className="container mx-auto p-8">
      {/* Main Thread Post */}
      <div className="border-b-2 pb-6 mb-6">
        <h1 className="text-4xl font-bold mb-4">{thread.title}</h1>
        <p className="text-lg text-gray-700 mb-4">{thread.content}</p>

        {thread.tags && thread.category_name === 'Marketplace' && (
          <div className="flex flex-wrap gap-2 pt-2 pb-4 mt-4 border-b">
            {thread.tags.map((tag: string) => (
              <span key={tag} className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-sm text-gray-500">
  Posted by {thread.author_name} on {new Date(thread.created_at).toLocaleDateString()} at {new Date(thread.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

        </p>
        <LikeButton threadId={thread.id} likeCount={thread.like_count} />
      </div>

      {/* Replies Section */}
      <h2 className="text-2xl font-semibold mb-4">Replies</h2>
      <div className="space-y-4">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className="border rounded-lg p-4 bg-gray-50">
              <p className="text-gray-800">{reply.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by {reply.author_name} on {new Date(reply.created_at).toLocaleDateString()} at {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
