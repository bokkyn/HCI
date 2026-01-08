import Link from "next/link"
import { Suspense } from "react"
import { Button } from "../_components/ui/button"
import { BlogPageSkeleton } from "../_components/blog-skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { unstable_noStore as noStore } from 'next/cache'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface PageProps {
  searchParams: Promise<{
    page?: string
  }>
}

const POSTS_PER_PAGE = 9

async function getPosts(): Promise<Post[]> {
  noStore() 
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      //next: { revalidate: 3600 }, // Revalidate every hour
      cache: 'no-store'
    })
    if (!res.ok) throw new Error("Failed to fetch posts")
    return res.json()
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

async function BlogGrid({ page }: { page: number }) {
  const posts = await getPosts()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const startIdx = (page - 1) * POSTS_PER_PAGE
  const paginatedPosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE)

  return (
    <>
      <div className="grid gap-6 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Članak #{post.id}
                </span>
              </div>
              <h2 className="mb-4 text-xl font-bold line-clamp-2 text-gray-800">{post.title}</h2>
              <p className="mb-6 flex-grow text-gray-600 line-clamp-3 leading-relaxed">{post.body}</p>
              <Link href={`/blog/${post.id}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 rounded-lg transition-all duration-300 hover:shadow-lg">
                  Pročitaj više
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/blog?page=${page - 1}`}>
              <Button variant="outline" className="gap-2 border-green-200 text-green-700 hover:bg-green-50">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prethodna</span>
              </Button>
            </Link>
          )}

          {/* Page Numbers */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              
              return (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`h-10 w-10 flex items-center justify-center rounded-lg font-medium transition-all duration-300 ${
                    pageNum === page
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
            
            {totalPages > 5 && page < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <Link
                  href={`/blog?page=${totalPages}`}
                  className="h-10 w-10 flex items-center justify-center rounded-lg font-medium bg-white text-gray-700 border border-gray-200 hover:bg-green-50"
                >
                  {totalPages}
                </Link>
              </>
            )}
          </div>

          {page < totalPages && (
            <Link href={`/blog?page=${page + 1}`}>
              <Button variant="outline" className="gap-2 border-green-200 text-green-700 hover:bg-green-50">
                <span className="hidden sm:inline">Sljedeća</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Stranica {page} od {totalPages} • Ukupno {posts.length} članaka
        </p>
      </div>
    </>
  )
}

export const metadata = {
  title: "Blog - Moja Web Stranica",
  description: "Čitajte savjete i članke o raznim temama",
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || "1", 10))

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Hero Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-green-100 rounded-full">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              <span className="text-sm font-medium text-green-700">BLOG & ČLANCI</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl text-gray-900">
              Istražite naše članke
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
              Pronađite korisne savjete, vodiče i informacije o raznim temama
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white shadow-2xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Istaknuto
              </span>
              <h2 className="mt-4 text-2xl font-bold md:text-3xl">
                5 Ključnih Koraka za Efektivno Postavljanje Ciljeva
              </h2>
              <p className="mt-3 opacity-90">
                Otkrijte kako pravilno postaviti ciljeve koji su ostvarivi, mjerljivi i motivirajući za dugoročni uspjeh.
              </p>
              <Link href="/blog/1" className="inline-block mt-6">
                <Button className="bg-white text-green-700 hover:bg-green-50 font-medium">
                  Pročitaj članak
                </Button>
              </Link>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <Suspense fallback={<BlogPageSkeleton />}>
            <BlogGrid page={page} />
          </Suspense>

          
        </div>
      </section>
    </main>
  )
}