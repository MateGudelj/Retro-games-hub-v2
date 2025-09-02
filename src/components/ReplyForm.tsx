
"use client";

import { createReply } from "@/app/actions";
import { useRef } from "react";

export default function ReplyForm({ threadId }: { threadId: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await createReply(formData);
        formRef.current?.reset();
      }} 
      className="space-y-4"
    >
      <input type="hidden" name="threadId" value={threadId} />
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-300">
          
        </label>
        <textarea
          name="content"
          id="content"
          required
          rows={4}
          // Added dark mode styling to match our other inputs
          className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-300 sm:text-sm p-2"
        />
      </div>
      <button 
        type="submit" 
        // Updated button styles to match our theme
        className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all duration-300"
      >
        Post Reply
      </button>
    </form>
  );
}