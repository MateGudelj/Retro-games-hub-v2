import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// A function to fetch all categories from the database
async function getCategories() {
  // Supabase query to select all rows from the 'categories' table
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export default async function ForumPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Forum Categories</h1>
      <div className="space-y-4">
        {categories.map((category) => {
          // Create a URL-friendly "slug" from the category name
          const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link
              href={`/forum/${categorySlug}`}
              key={category.id}
              className="block border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold">{category.name}</h2>
              <p className="text-gray-600 mt-2">{category.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
