import { getBlogPost } from "../getBlogPosts";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types"; // Obavezno uvezi ovo
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

// Opcije za kontrolu izgleda Rich Text elemenata
const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-8 leading-relaxed text-lg md:text-xl">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-3xl md:text-4xl font-bold text-[#104d2f] mt-16 mb-6">{children}</h2>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc pl-6 mb-8 space-y-4 text-lg">{children}</ul>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) return notFound();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#2b946f] font-medium transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          Natrag na pregled članaka
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#104d2f] mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-500 text-lg">
            <Calendar size={20} className="text-[#2b946f]" />
            <span>{formatDate(post.date)}</span>
          </div>
        </header>

        <div className="relative h-[300px] md:h-[500px] w-full mb-16 rounded-3xl overflow-hidden shadow-2xl">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        </div>

        {/* GLAVNI TEKST - Ovdje primjenjujemo stilove */}
        <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 selection:bg-[#2b946f]/20">
          {documentToReactComponents(post.content, renderOptions)}
        </div>
      </div>
    </article>
  );
}