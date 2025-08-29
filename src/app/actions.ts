"use server"; // Mark this file as containing server-side actions

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // For public queries
import { getAuthenticatedSupabaseClient } from "@/lib/supabaseClientAuthenticated";

export async function toggleBookmark(threadId: number) {
  const { supabase, session } = await getAuthenticatedSupabaseClient();
  const userId = session.user.id;

  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('thread_id', threadId)
    .eq('user_id', userId)
    .single();

  if (existingBookmark) {
    await supabase.from('bookmarks').delete().match({ id: existingBookmark.id });
  } else {
    await supabase.from('bookmarks').insert({ thread_id: threadId, user_id: userId });
  }

  // Revalidate the profile page to show the updated list
  revalidatePath("/profile");
  // Revalidate the thread page as well, in case we want to show a "bookmarked" state later
  revalidatePath(`/forum/threads/${threadId}`);
}

export async function createReply(formData: FormData) {
  const { supabase, session } = await getAuthenticatedSupabaseClient();

  const content = formData.get("content") as string;
  const threadId = formData.get("threadId") as string;
  const userId = session.user.id;

  if (!content || !threadId) {
    throw new Error("Content and thread ID are required.");
  }

  const { error } = await supabase.from("replies").insert({
    content: content,
    thread_id: parseInt(threadId, 10),
    user_id: userId,
  });

  if (error) {
    console.error("Error creating reply:", error);
    throw new Error("Failed to create reply.");
  }

  // Revalidate the path of the thread page to show the new reply instantly
  revalidatePath(`/forum/threads/${threadId}`);
}

export async function searchTags(query: string) {
  if (!query) {
    return [];
  }

  // We use the public client because anyone can search for tags
  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .ilike('name', `%${query}%`) // ilike is case-insensitive
    .limit(5); // Limit to 5 suggestions

  if (error) {
    console.error("Error searching tags:", error);
    return [];
  }

  return data;
}

export async function createThread(formData: FormData) {
  // Get both the authenticated client and the session in one call
  const { supabase, session } = await getAuthenticatedSupabaseClient();

  const userId = session.user.id; 
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = formData.get('categoryId') as string;
  const tagsString = formData.get('tags') as string | null; // Get the new tags string

   const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', categoryId)
    .single();

  if (category?.name.toLowerCase() === 'marketplace' && (!tagsString || tagsString.trim() === '')) {
    // We can handle this more gracefully later, but for now, an error is fine.
    throw new Error("Marketplace posts must have at least one tag.");
  }

  // 1. Insert the thread and get its ID back
  const { data: newThread, error: threadError } = await supabase
    .from('threads')
    .insert({
      title: title,
      content: content,
      category_id: parseInt(categoryId, 10),
      user_id: userId,
    })
    .select('id') // This asks Supabase to return the 'id' of the new row
    .single(); // We expect only one row back

  if (threadError || !newThread) {
    console.error("Error creating thread:", threadError);
    throw new Error("Failed to create thread.");
  }

// --- NEW TAG LOGIC ---
  if (tagsString) {
    const tagNames = tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);

    if (tagNames.length > 0) {
      // 1. Look up which of the provided tags already exist in our database.
      const { data: existingTags, error: tagsError } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", tagNames); // .in() finds all rows that match a value in the array

      if (tagsError) {
        console.error("Error fetching existing tags:", tagsError);
        throw new Error("Failed to process tags.");
      }

      // 2. If we found any valid tags, link them to the new thread.
      if (existingTags && existingTags.length > 0) {
        const threadTags = existingTags.map(tag => ({
          thread_id: newThread.id,
          tag_id: tag.id
        }));
        
        const { error: threadTagsError } = await supabase.from("thread_tags").insert(threadTags);

        if (threadTagsError) {
          console.error("Error linking tags to thread:", threadTagsError);
          throw new Error("Failed to link tags.");
        }
      }
    }
  }

  revalidatePath("/forum");
  redirect("/forum"); 
}


export async function toggleLike(threadId: number) {

  console.log(`Toggling like for thread ID: ${threadId}`); 

  const { supabase, session } = await getAuthenticatedSupabaseClient();

  const userId = session.user.id;

  // First, check if the user has already liked this thread
  const { data: existingLike, error: selectError } = await supabase
    .from('likes')
    .select('id')
    .eq('thread_id', threadId)
    .eq('user_id', userId)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = row not found, which is fine
    console.error("Error checking for like:", selectError);
    return;
  }

  if (existingLike) {
    // If a like exists, delete it (unlike)
    await supabase.from('likes').delete().match({ id: existingLike.id });
  } else {
    // If no like exists, create one
    await supabase.from('likes').insert({ thread_id: threadId, user_id: userId });
  }

  // Revalidate the path to update the like count on the page
  revalidatePath("/forum", "layout");
}