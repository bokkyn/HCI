import { getBlogPosts } from "./getBlogPosts";
import BlogList from "@/components/BlogList";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogList posts={posts} />;
}