"use server"; // Mark this file as containing server-side actions

//import { getSupabaseClientAuthenticated } from "@/lib/supabaseClientAuthenticated";
//import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export async function createThread(formData: FormData) {
  const session = await getServerSession(authOptions);
    // Ensure the user and the access token exist
  if (!session?.user || !session.supabaseAccessToken) {
    throw new Error("You must be logged in to create a thread.");
  }
//   if (!session || !session.user) {
//     throw new Error("You must be logged in to create a thread.");
//   }

const { supabaseAccessToken } = session

  // Create a new Supabase client for this user's request
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );

//   const supabase = await getSupabaseClientAuthenticated();
//   const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//     throw new Error("User not found in Supabase.");
//   }
  // Extract data from the form
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = formData.get('categoryId') as string;
  const userId = session.user.id; // (old) Get the user's ID from the session

-
  console.log("--- Creating Thread ---");
  console.log("User ID:", userId);
  console.log("Title:", title);
  console.log("Content:", content);
  console.log("Category ID:", categoryId);
  console.log("Session Token Snippet:", session.supabaseAccessToken.slice(0, 15) + "...");
  // ------------------------------------

  // Insert data into Supabase
  const { error } = await supabase.from('threads').insert({
    title: title,
    content: content,
    category_id: parseInt(categoryId, 10),
    user_id: userId, //<here is old//user.id, // Use the ID from Supabase Auth
  });

  
  if (error) {
    console.error("Error creating thread:", error);
    // You could return an error message here
    return;
  }

  // Revalidate the path to show the new thread immediately
  revalidatePath("/forum");

  // Redirect the user back to the main forum page (or a new thread page)
  redirect("/forum"); 
}