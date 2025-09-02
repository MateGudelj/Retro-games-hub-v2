
import { client } from '@/lib/contentfulClient';
import Link from 'next/link';
import type { EntrySkeletonType } from 'contentful';
import SearchBlog from '@/components/SearchBlog';
import Image from 'next/image'; 
import { formatTimeAgo } from '@/lib/timeUtils';


interface BlogPostSkeleton extends EntrySkeletonType {
    fields: {
        title: string;
        slug: string;
        publicationDate: string;
        summary: string;     
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mainImage: any;//deeply nested troublesome object
  }
    contentTypeId: 'blogPost'
}

// The function is updated to fetch the new fields
async function getBlogPosts(query?: string) {
  const options = {
    content_type: 'blogPost' as const,
    order: ['-fields.publicationDate'],
    ...(query && { 'query': query }),
  };

  const entries = await client.getEntries<BlogPostSkeleton>(options);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return entries.items as any[];
}


export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const query = (await searchParams)?.query;
  const posts = await getBlogPosts(query);

 return (
    <div className="container max-w-5xl mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-100">Retro Games Blog</h1>
      
      <SearchBlog />

      <div className="max-w-5xl mx-auto space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              href={`/blog/${post.fields.slug}`}
              key={post.sys.id}
              className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-slate-800 border border-slate-700 hover:border-indigo-600 transition-all duration-300"
            >
              {post.fields.mainImage?.fields?.file?.url && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={`https:${post.fields.mainImage.fields.file.url}`}
                    alt={post.fields.mainImage.fields.description || post.fields.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="p-6">
                
                <h2 className="text-xl font-bold text-slate-100 mb-2 break-words">
                  {post.fields.title}
                </h2>
                
                <p className="text-slate-400 text-sm mb-4 break-words">
                  {post.fields.summary}
                </p>
                <p className="text-xs text-slate-500 pt-4 border-t border-slate-700">
                  {formatTimeAgo(post.fields.publicationDate)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-slate-500">
            No posts found. Try a different search?
          </p>
        )}
      </div>
    </div>
  );
}