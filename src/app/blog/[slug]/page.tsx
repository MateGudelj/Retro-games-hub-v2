// import { client } from "@/lib/contentfulClient";
// import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import type {
//   Asset,
//   EntrySkeletonType,
// } from "contentful";

// import type { Document } from "@contentful/rich-text-types";

// // Asset typing
// interface ImageAsset extends Asset {
//   fields: {
//     title: string;
//     description: string;
//     file: {
//       url: string;
//       fileName: string;
//       contentType: string;
//       details: { size: number; image?: { width: number; height: number } };
//     };
//   };
// }

// // Entry typing
// interface BlogPostSkeleton extends EntrySkeletonType {
//   contentTypeId: "blogPost";
//   fields: {
//     title: string;
//     slug: string;
//     publicationDate: string;
//     mainImage: ImageAsset;
//     content: Document;
//   };
// }

// async function getBlogPost(slug: string) {
//   const entries = await client.getEntries<BlogPostSkeleton>({
//     content_type: "blogPost",
//     // @ts-expect-error Contentful query typing is too strict
//     "fields.slug": slug,
//     include: 2,
//   });
//   if (entries.items.length === 0) {
//     return null;
//   }
//   return entries.items[0];
// }

// export default async function BlogPostPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const post = await getBlogPost(slug);

//   //console.log("SINGLE POST DATA:", post);

//   if (!post) {
//     notFound();
//   }

//   const { title, publicationDate, mainImage, content } = post.fields;

//   return (
//     <article className="container mx-auto p-4 md:p-8">
//       <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">
//         {title}
//       </h1>
//       <p className="text-center text-gray-500 mb-8">
//         Published on {new Date(publicationDate).toLocaleDateString()}
//       </p>

//       {mainImage && mainImage["fields"] && mainImage["fields"]["file"] && (
//         <div className="relative h-64 md:h-96 mb-8">
//           <Image
//             src={`https:${mainImage["fields"]["file"]["url"]}`}
//             alt={mainImage["fields"]["description"] || title}
//             fill
//             style={{ objectFit: "cover" }}
//             className="rounded-lg"
//           />
//         </div>
//       )}

//       {/* Use base 'prose' on small screens, and make it larger ('prose-lg') on large screens. */}
//       <div className="prose md:prose-lg max-w-none mx-auto">
//         {content ? documentToReactComponents(content) : null}
//       </div>
//     </article>
//   );
// }

// // src/app/blog/[slug]/page.tsx
// import { client } from '@/lib/contentfulClient';
// import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import { BLOCKS, Document } from '@contentful/rich-text-types'; // Import Document type

// // A function to fetch a single blog post
// async function getBlogPost(slug: string) {
//   const queryOptions = {
//     content_type: 'blogPost' as const,
//     'fields.slug': slug,
//     include: 2, // This is crucial to get linked image data
//   };
//   const entries = await client.getEntries(queryOptions);
//   if (entries.items.length === 0) {
//     return null;
//   }
//   // We use 'as any' as a definitive escape hatch to stop all type errors.
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return entries.items[0] as any;
// }

// export default async function BlogPostPage({ params }: { params: { slug:string } }) {
//   const post = await getBlogPost(params.slug);

//   if (!post) {
//     notFound();
//   }

//   const { title, publicationDate, mainImage, content } = post.fields;

//   // This is the instruction manual for our rich text renderer.
//   const options: Options = {
//     renderNode: {
//       // Use the correct constant: BLOCKS.OL_LIST
//       [BLOCKS.OL_LIST]: (node, children) => (
//         <ol className="list-decimal ml-10 my-4">{children}</ol>
//       ),
//       // This is the correct way to render an embedded image when using the REST client
//       [BLOCKS.EMBEDDED_ASSET]: (node) => {
//         // The data is already resolved and attached directly to the node.
//         const { file, title: imageTitle, description } = node.data.target.fields;

//         return (
//           <div className="my-8 flex justify-center">
//             <Image
//               src={`https:${file.url}`}
//               alt={description || imageTitle}
//               width={file.details.image.width}
//               height={file.details.image.height}
//               className="rounded-lg shadow-md max-w-full h-auto"
//             />
//           </div>
//         );
//       },
//     },
//   };

//   return (
//     <article className="container mx-auto p-4 md:p-8">
//       <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">{title}</h1>
//       <p className="text-center text-gray-500 mb-8">
//         Published on {new Date(publicationDate).toLocaleDateString()}
//       </p>

//       {mainImage && (
//         <div className="relative h-64 md:h-96 mb-8">
//           <Image
//             src={`https:${mainImage.fields.file.url}`}
//             alt={mainImage.fields.description || title}
//             fill
//             style={{ objectFit: 'cover' }}
//             className="rounded-lg"
//           />
//         </div>
//       )}

//       <div className="prose lg:prose-xl max-w-none mx-auto">
//         {/* We add a safety check and cast 'content' to the Document type */}
//         {content ? documentToReactComponents(content as Document, options) : null}
//       </div>
//     </article>
//   );
// }

// src/app/blog/[slug]/page.tsx
import { client } from "@/lib/contentfulClient";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BLOCKS } from "@contentful/rich-text-types";

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

  // This is our instruction manual for the renderer.
  const options: Options = {
    renderNode: {
      // --- ADDED: Rule for Unordered Lists ---
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc ml-10 my-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal ml-10 my-4">{children}</ol>
      ),
// This is the new, robust version with error handling
[BLOCKS.EMBEDDED_ASSET]: (node) => {
  // Get the fields from the asset
  const { file, title, description } = node.data.target.fields;
  const contentType = file.contentType;

  // --- THIS IS THE NEW ERROR HANDLING LOGIC ---
  // Check if the asset is an image
  if (contentType.startsWith('image/')) {
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
  // --- END OF NEW LOGIC ---
},
      // --- ADDED: Rule for Embedded Entries (our video) ---
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
    <article className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">
        {title}
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Published on {new Date(publicationDate).toLocaleDateString()}
      </p>

      {mainImage && (
        <div className="relative h-64 md:h-96 mb-8">
          <Image
            src={`https:${mainImage.fields.file.url}`}
            alt={mainImage.fields.description || title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="prose lg:prose-xl max-w-none mx-auto">
        {content ? documentToReactComponents(content, options) : null}
      </div>
    </article>
  );
}
