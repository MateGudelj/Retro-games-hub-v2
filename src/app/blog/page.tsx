import { client } from '@/lib/contentfulClient';
import Link from 'next/link';
import type { Entry, EntrySkeletonType } from 'contentful';


interface BlogPostSkeleton extends EntrySkeletonType {
    fields: {
        title: string;
        slug: string;
        publicationDate: string;
        //[key: string]: any;
  }
    // We add this to satisfy the base skeleton type
  contentTypeId: 'blogPost'
}

// Function to fetch blog posts
async function getBlogPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost', // The API ID of content model
    order: ['-fields.publicationDate'], // Order by newest first
  });
  return entries.items as Entry<BlogPostSkeleton>[];;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

   // no posts yet check
  if (!posts || posts.length === 0) {
    return <div className="container mx-auto p-8 text-center">No posts found.</div>
  }

  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Retro Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={`/blog/${post.fields.slug}`}
            key={post.sys.id}
            className="border rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{post.fields.title as unknown as string}</h2>
            <p className="text-gray-600">
              {new Date(post.fields.publicationDate as unknown as string).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
