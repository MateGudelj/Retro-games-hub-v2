
"use client";
    
import { useOptimistic, useTransition } from 'react';
import { toggleBookmark } from '@/app/actions';

export function BookmarkButton({ 
  threadId, 
  isInitiallyBookmarked 
}: { 
  threadId: number, 
  isInitiallyBookmarked: boolean 
}) {
  const [isPending, startTransition] = useTransition();
  
  //  Use the useOptimistic hook.
  // It takes the "real" state (isInitiallyBookmarked) and a function to calculate the temporary state.
  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    isInitiallyBookmarked,
    (currentState) => !currentState // The optimistic update is to simply flip the boolean
  );

  const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    startTransition(() => {
 
      setOptimisticBookmarked(!optimisticBookmarked);

      toggleBookmark(threadId);
    });
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isPending}
      //  The button's style is now controlled by our optimistic state.
      className={`flex items-center gap-1 text-sm disabled:opacity-50 ${
        optimisticBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
      }`}
      title={optimisticBookmarked ? "Remove from bookmarks" : "Save for later"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill={optimisticBookmarked ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}