// src/components/ReplyForm.tsx
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
      {/* We add a hidden input to send the threadId along with the form */}
      <input type="hidden" name="threadId" value={threadId} />
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Your Reply
        </label>
        <textarea
          name="content"
          id="content"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>
      <button 
        type="submit" 
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
      >
        Post Reply
      </button>
    </form>
  );
}