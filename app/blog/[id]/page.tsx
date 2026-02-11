import { getBlogPost } from "../getBlogPosts";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    return notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2b946f] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Natrag na blog
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-[#104d2f] mb-6">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <Calendar size={18} />
          <span>{formatDate(post.date)}</span>
        </div>

        <div className="relative h-[400px] w-full mb-10 rounded-2xl overflow-hidden shadow-lg">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-[#104d2f] prose-a:text-[#2b946f]">
          {documentToReactComponents(post.content)}
        </div>
      </div>
    </article>
  );
}