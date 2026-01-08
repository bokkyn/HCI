export function BlogPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-12 w-48 mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="h-4 w-20 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlogPostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-6 w-32 bg-gray-200 rounded mb-8 animate-pulse"></div>
      <div className="rounded-2xl bg-white shadow-xl p-8 md:p-12">
        <div className="h-4 w-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-12 animate-pulse"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}