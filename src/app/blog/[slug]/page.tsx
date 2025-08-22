import { client } from "@/lib/contentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { notFound } from "next/navigation";
import Image from "next/image";
import type {
  Asset,
  Entry,
  EntrySkeletonType,
  EntryCollection,
  EntriesQueries,
} from "contentful";

import type { Document } from "@contentful/rich-text-types";

// Asset typing
interface ImageAsset extends Asset {
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      fileName: string;
      contentType: string;
      details: { size: number; image?: { width: number; height: number } };
    };
  };
}

// Entry typing
interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: "blogPost";
  fields: {
    title: string;
    slug: string;
    publicationDate: string;
    mainImage: ImageAsset;
    content: Document;
  };
}

async function getBlogPost(slug: string) {
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: "blogPost",
    // @ts-expect-error Contentful query typing is too strict
    "fields.slug": slug,
    include: 2,
  });
  if (entries.items.length === 0) {
    return null;
  }
  return entries.items[0];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  //console.log("SINGLE POST DATA:", post);

  if (!post) {
    notFound();
  }

  const { title, publicationDate, mainImage, content } = post.fields;

  return (
    <article className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-center">
        {title}
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Published on {new Date(publicationDate).toLocaleDateString()}
      </p>

      {mainImage && mainImage["fields"] && mainImage["fields"]["file"] && (
        <div className="relative h-64 md:h-96 mb-8">
          <Image
            src={`https:${mainImage["fields"]["file"]["url"]}`}
            alt={mainImage["fields"]["description"] || title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="prose lg:prose-xl max-w-none mx-auto">
        {content ? documentToReactComponents(content) : null}
      </div>
    </article>
  );
}
