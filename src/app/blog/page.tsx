import { client } from '@/lib/contentfulClient';
import Link from 'next/link';
import type { EntrySkeletonType } from 'contentful';
import SearchBlog from '@/components/SearchBlog';

interface BlogPostSkeleton extends EntrySkeletonType {
    fields: {
        title: string;
        slug: string;
        publicationDate: string;
  }
    contentTypeId: 'blogPost'
}

// function to accept an optional search query
async function getBlogPosts(query?: string) {
  const options = {
    content_type: 'blogPost' as const,
    order: ['-fields.publicationDate'],
    // If a query is provided, Contentful will perform a full-text search
    ...(query && { 'query': query }),
  };

  // The <BlogPostSkeleton> generic is added here for type safety
  const entries = await client.getEntries<BlogPostSkeleton>(options);
  return entries.items;
}


export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const query = (await searchParams)?.query;
  const posts = await getBlogPosts(query);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Retro Blog</h1>
      
      <SearchBlog />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* We add a check for when a search returns no results */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              href={`/blog/${post.fields.slug}`}
              key={post.sys.id}
              className="border rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.fields.title}</h2>
              <p className="text-gray-600">
                {new Date(post.fields.publicationDate).toLocaleDateString()}
              </p>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No posts found. Try a different search?
          </p>
        )}
      </div>
    </div>
  );
}

