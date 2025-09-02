// src/app/blog/[slug]/page.tsx
import { client } from "@/lib/contentfulClient";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

// Data fetching function (using 'any' to bypass complex typing)
async function getBlogPost(slug: string) {
  const queryOptions = {
    content_type: "blogPost" as const,
    "fields.slug": slug,
    include: 3, // Increased include level to be safe for nested entries
  };
  const entries = await client.getEntries(queryOptions);
  if (entries.items.length === 0) {
    return null;
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  return entries.items[0] as any;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { title, publicationDate, mainImage, content } = post.fields;

  
  const options: Options = {
    renderNode: {
      
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 className="text-4xl font-bold my-6 text-slate-100">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2 className="text-3xl font-semibold my-5 text-slate-200">
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3 className="text-2xl font-semibold my-4 text-slate-200">
          {children}
        </h3>
      ),
      
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc ml-10 my-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal ml-10 my-4">{children}</ol>
      ),
      
      [INLINES.HYPERLINK]: (node, children) => {
        const { uri } = node.data;
        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {children}
          </a>
        );
      },
      
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // Get the fields from the asset
        const { file, title, description } = node.data.target.fields;
        const contentType = file.contentType;

        
        // Check if the asset is an image
        if (contentType.startsWith("image/")) {
          // If it's an image, render the Next.js Image component
          return (
            <div className="my-8 flex justify-center">
              <Image
                src={`https:${file.url}`}
                alt={description || title}
                width={file.details.image.width}
                height={file.details.image.height}
                className="rounded-lg shadow-md max-w-full h-auto"
              />
            </div>
          );
        } else {
          // If it's NOT an image, render a simple download link as a fallback
          return (
            <div className="my-8 p-4 border rounded-lg bg-gray-50">
              <a
                href={`https:${file.url}`}
                download={file.fileName}
                className="font-medium text-indigo-600 hover:underline"
              >
                Download {file.fileName}
              </a>
            </div>
          );
        }
        
      },
      
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // Check if the embedded entry is our 'videoEmbed' type
        if (node.data.target.sys.contentType.sys.id === "videoEmbed") {
          const { title: videoTitle, embedUrl } = node.data.target.fields;
          return (
            <div className="my-8 aspect-video">
              <iframe
                src={embedUrl}
                height="100%"
                width="100%"
                frameBorder="0"
                scrolling="no"
                title={videoTitle}
                allowFullScreen={true}
                className="rounded-lg shadow-md"
              />
            </div>
          );
        }
        return null; // Return null for any other embedded entry types
      },
    },
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-8">
      {/* --- CARD CONTAINER --- */}

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 md:p-8">
        <article>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center text-slate-100">
            {title}
          </h1>
          <p className="text-center text-slate-500 mb-8">
            Published on {new Date(publicationDate).toLocaleDateString()}
          </p>

          {mainImage && (
            <div className="my-8 flex justify-center">
              <Image
                src={`https:${mainImage.fields.file.url}`}
                alt={mainImage.fields.description || title}
                // We now pass the real width and height from Contentful
                width={mainImage.fields.file.details.image.width}
                height={mainImage.fields.file.details.image.height}
                // These classes make the image responsive while maintaining its aspect ratio
                className="rounded-lg shadow-md max-w-full h-auto"
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl max-w-none mx-auto">
            {content ? documentToReactComponents(content, options) : null}
          </div>
        </article>
      </div>
    </div>
  );
}
