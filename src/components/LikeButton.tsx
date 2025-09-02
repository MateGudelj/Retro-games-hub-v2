
"use client";

import { useOptimistic, useTransition } from 'react';
import { toggleLike } from '@/app/actions';

export default function LikeButton({ 
  threadId, 
  likeCount,
  isInitiallyLiked
}: { 
  threadId: number, 
  likeCount: number,
  isInitiallyLiked: boolean
}) {
  const [isPending, startTransition] = useTransition();

  // The optimistic state now tracks both the count and the user's liked status
  const [optimisticState, setOptimisticState] = useOptimistic(
    { count: likeCount, liked: isInitiallyLiked },
    (currentState) => ({
      // The new state is to flip the 'liked' boolean and adjust the count accordingly
      liked: !currentState.liked,
      count: currentState.liked ? currentState.count - 1 : currentState.count + 1,
    })
  );

  const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    startTransition(() => {
      // We pass the current state to the updater function
      setOptimisticState({ count: optimisticState.count, liked: optimisticState.liked });
      toggleLike(threadId);
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-1 text-sm disabled:opacity-50 ${
        optimisticState.liked ? 'text-pink-700' : 'text-gray-500 hover:text-pink-500'
      }`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        // The fill is now controlled by the optimistic 'liked' state
        fill={optimisticState.liked ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {/* The count is now controlled by the optimistic 'count' state */}
      <span>{optimisticState.count}</span>
    </button>
  );
}