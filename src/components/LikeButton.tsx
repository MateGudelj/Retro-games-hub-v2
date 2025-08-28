"use client";

import { useTransition } from 'react';
import { toggleLike } from '@/app/actions';

export default function LikeButton({ threadId, likeCount }: { threadId: number, likeCount: number }) {
  // useTransition is a React hook to handle pending states for server actions
  const [isPending, startTransition] = useTransition();

  const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
        // These two lines stop the parent <Link> from being triggered
    event.preventDefault();
    event.stopPropagation();
    
    // startTransition will run our server action without blocking the UI
    startTransition(async () => {
      await toggleLike(threadId);
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending} // Disable the button while the action is running
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {/* We pass the original likeCount here. The revalidatePath will refresh it. */}
      <span>{likeCount}</span>
    </button>
  );
}