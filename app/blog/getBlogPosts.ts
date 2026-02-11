import { client } from "./contentful";

export async function getBlogPosts() {
  const response = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.publishedDate"],
  });

  return response.items.map((post: any) => ({
    id: post.sys.id,
    title: post.fields.title,
    subtitle: post.fields.subtitle,
    date: post.fields.publishedDate,
    content: post.fields.content,
    image: post.fields.featuredImage?.fields?.file?.url
        ? `https:${post.fields.featuredImage.fields.file.url}`
        : "/placeholder.jpg",
    slug: post.fields.slug,
  }));
}

export async function getBlogPost(slug: string) {
  const response = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  const post: any = response.items[0];

  if (!post) return null;

  return {
    id: post.sys.id,
    title: post.fields.title,
    content: post.fields.content,
    date: post.fields.publishedDate,
    image: `https:${post.fields.featuredImage?.fields?.file?.url}`,
  };
}