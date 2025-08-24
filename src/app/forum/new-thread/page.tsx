import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import NewThreadForm from "@/components/NewThreadForm";
import { authOptions } from "@/lib/authOptions";


async function getCategories() {
  const { data, error } = await supabase.from('categories').select('id, name');
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export default async function NewThreadPage() {
  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect them to the homepage.
  if (!session || !session.user) {
    redirect('/');
  }

  const categories = await getCategories();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Create a New Thread</h1>
      {/* We'll pass the user's ID and the categories to the form component */}
      <NewThreadForm userId={session.user.id} categories={categories} />
    </div>
  );
}