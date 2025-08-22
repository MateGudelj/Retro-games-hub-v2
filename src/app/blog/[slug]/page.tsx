import { client } from '@/lib/contentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// We fetch the data without a complex blueprint to avoid type errors.
async function getBlogPost(slug: string) {
  const queryOptions = {
    content_type: 'blogPost',
    'fields.slug': slug,
    include: 2, // This is important to get linked image data
  };
  const entries = await client.getEntries(queryOptions);

  if (entries.items.length === 0) {
    return null;
  }
  // We use 'as any' as an escape hatch to stop the type errors.
  return entries.items[0] as any;
}


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // We await the params object to access its properties.
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound(); // If no post is found, show a 404 page
  }

  // We can now access the fields directly.
  const { title, publicationDate, mainImage, content } = post.fields;

  return (
    <article className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">{title}</h1>
      <p className="text-center text-gray-500 mb-8">
        Published on {new Date(publicationDate).toLocaleDateString()}
      </p>

      {/* This runtime check is important for safety */}
      {mainImage && (
        <div className="relative h-64 md:h-96 mb-8">
          <Image
            src={`https:${mainImage.fields.file.url}`}
            alt={mainImage.fields.description || title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      )}

      {/* This runtime check is also important */}
      <div className="prose lg:prose-xl max-w-none mx-auto">
        {content ? documentToReactComponents(content) : null}
      </div>
    </article>
  );
}