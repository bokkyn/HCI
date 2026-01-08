import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from "lucide-react"
import { Button } from "../../_components/ui/button"
import { BlogPostDetailSkeleton } from "../../_components/blog-skeleton"

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error("Failed to fetch post")
    return res.json()
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

async function getRelatedPosts(currentId: string): Promise<Post[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    const posts: Post[] = await res.json()
    return posts
      .filter(post => post.id.toString() !== currentId)
      .slice(0, 3)
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

async function BlogPostContent({ id }: { id: string }) {
  const [post, relatedPosts] = await Promise.all([
    getPost(id),
    getRelatedPosts(id)
  ])

  if (!post) {
    return (
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Blog post nije pronađen</h1>
          <p className="mb-6 text-gray-600">Izvinjavam se, blog post koji tražite ne postoji.</p>
          <Link href="/blog">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Povratak na blog
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Povratak na blog
            </Link>
          </div>

          {/* Main Article */}
          <article className="rounded-2xl bg-white shadow-xl overflow-hidden">
            {/* Article Header */}
            <div className="p-8 md:p-12 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-sm font-semibold uppercase tracking-wider text-green-700 bg-green-100 px-4 py-2 rounded-full">
                    Članak #{post.id}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      18. siječnja 2025.
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      ~{Math.ceil(post.body.split(" ").length / 200)} min čitanja
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Admin</p>
                      <p className="text-sm text-gray-600">Autor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <button className="p-2 rounded-full hover:bg-green-100 transition-colors">
                      <Bookmark className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-green-100 transition-colors">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-lg max-w-none">
                  {post.body.split("\n").map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-6 leading-relaxed text-gray-700 text-lg">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {["Tehnologija", "Lifestyle", "Edukacija", "Savjeti", "Novosti"].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="mt-12 p-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4">Želite više sadržaja?</h3>
                    <p className="mb-6 opacity-90">
                      Pretplatite se na naš newsletter kako biste dobijali najnovije članke i savjete direktno na email.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="Tvoj email"
                            className="flex-grow px-4 py-3 rounded-lg text-gray-900"
                          />
                          <Button className="bg-white text-green-700 hover:bg-green-50 font-medium py-3">
                            Pretplati se
                          </Button>
                        </div>
                      </div>
                      <Link href="/blog" className="flex-1">
                        <Button className="w-full bg-transparent border-2 border-white hover:bg-white/10 font-medium py-3">
                          Vidi sve članke
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-4 py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Slični članci
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl"
                >
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Članak #{relatedPost.id}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-gray-900 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {relatedPost.body}
                    </p>
                    <Link href={`/blog/${relatedPost.id}`} className="inline-block mt-6">
                      <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                        Pročitaj više
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPost((await params).id)
  return {
    title: post?.title ? `${post.title} - Blog` : "Blog Post",
    description: post?.body?.substring(0, 160) || "Pročitajte naš blog članak",
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    const posts: Post[] = await res.json()
    return posts.slice(0, 20).map((post) => ({
      id: String(post.id),
    }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Suspense fallback={<BlogPostDetailSkeleton />}>
        <BlogPostContent id={id} />
      </Suspense>
    </main>
  )
}