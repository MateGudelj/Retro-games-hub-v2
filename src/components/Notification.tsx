// src/components/Notification.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Notification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the 'success' message from the URL
  const successMessage = searchParams.get("success");
  const [isVisible, setIsVisible] = useState(!!successMessage);

  // This effect makes the notification visible when the page loads with the parameter
  useEffect(() => {
    setIsVisible(!!successMessage);
  }, [successMessage]);

  const handleClose = () => {
    setIsVisible(false);
    // Clean up the URL by removing the success parameter
    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!isVisible) {
    return null;
  }

  let message = "";
  if (successMessage === "thread-created") {
    message = "Thread successfully created!";
  } else if (successMessage === "reply-posted") {
    message = "Reply successfully posted!";
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-6" role="alert">
      <span className="block sm:inline">{message}</span>
      <button onClick={handleClose} className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
}