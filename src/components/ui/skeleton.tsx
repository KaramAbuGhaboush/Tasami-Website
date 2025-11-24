import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

// Shimmer effect variant
function SkeletonShimmer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800 skeleton-shimmer",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

// Text skeleton variants
function SkeletonText({
  lines = 1,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  if (lines === 1) {
    return <SkeletonShimmer className={cn("h-4 w-full", className)} {...props} />
  }
  
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonShimmer
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

// Image skeleton
function SkeletonImage({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <SkeletonShimmer className={cn("aspect-video w-full", className)} {...props} />
}

// Card skeleton
function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 p-6", className)} {...props}>
      <SkeletonShimmer className="h-48 w-full rounded-xl mb-4" />
      <SkeletonText lines={3} className="mb-4" />
      <div className="flex items-center gap-4">
        <SkeletonShimmer className="h-10 w-10 rounded-full" />
        <SkeletonText lines={1} className="flex-1" />
      </div>
    </div>
  )
}

// Blog post skeleton
function SkeletonBlogPost({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <article className={cn("", className)} {...props}>
      <SkeletonShimmer className="aspect-video w-full rounded-2xl mb-4" />
      <div className="px-2 space-y-3">
        <SkeletonShimmer className="h-6 w-3/4 rounded" />
        <SkeletonText lines={2} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonShimmer className="h-8 w-8 rounded-full" />
            <SkeletonText lines={1} className="w-24" />
          </div>
          <SkeletonShimmer className="h-4 w-16 rounded" />
        </div>
      </div>
    </article>
  )
}

// Featured blog post skeleton
function SkeletonFeaturedPost({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid lg:grid-cols-2 gap-12 items-center", className)} {...props}>
      <SkeletonShimmer className="aspect-video w-full rounded-3xl" />
      <div className="space-y-6">
        <div className="flex gap-4">
          <SkeletonShimmer className="h-4 w-20 rounded" />
          <SkeletonShimmer className="h-4 w-20 rounded" />
        </div>
        <SkeletonShimmer className="h-12 w-full rounded" />
        <SkeletonText lines={4} />
      </div>
    </div>
  )
}

// Project card skeleton
function SkeletonProjectCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100", className)} {...props}>
      <SkeletonShimmer className="h-64 w-full" />
      <div className="p-8 space-y-4">
        <SkeletonShimmer className="h-6 w-3/4 rounded" />
        <SkeletonText lines={3} />
        <div className="flex gap-2">
          <SkeletonShimmer className="h-6 w-20 rounded-full" />
          <SkeletonShimmer className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonShimmer className="h-4 w-32 rounded" />
      </div>
    </div>
  )
}

// Article content skeleton
function SkeletonArticleContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-8", className)} {...props}>
      <div className="space-y-4">
        <SkeletonShimmer className="h-4 w-full rounded" />
        <SkeletonShimmer className="h-4 w-5/6 rounded" />
        <SkeletonShimmer className="h-4 w-4/6 rounded" />
      </div>
      <SkeletonShimmer className="aspect-video w-full rounded-3xl" />
      <div className="space-y-4">
        <SkeletonText lines={5} />
        <SkeletonText lines={4} />
        <SkeletonText lines={6} />
      </div>
    </div>
  )
}

// Job listing skeleton
function SkeletonJobListing({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white border border-gray-200 rounded-2xl p-8", className)} {...props}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex-1 space-y-3">
          <SkeletonShimmer className="h-8 w-3/4 rounded" />
          <div className="flex gap-4">
            <SkeletonShimmer className="h-4 w-24 rounded" />
            <SkeletonShimmer className="h-4 w-24 rounded" />
            <SkeletonShimmer className="h-4 w-24 rounded" />
          </div>
        </div>
        <SkeletonShimmer className="h-8 w-24 rounded-full" />
      </div>
      <SkeletonText lines={2} className="mb-6" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <SkeletonShimmer className="h-5 w-32 rounded" />
          <SkeletonText lines={4} />
        </div>
        <div className="space-y-3">
          <SkeletonShimmer className="h-5 w-32 rounded" />
          <SkeletonText lines={4} />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <SkeletonShimmer className="h-12 w-32 rounded-full" />
        <SkeletonShimmer className="h-12 w-32 rounded-full" />
      </div>
    </div>
  )
}

// Testimonial skeleton
function SkeletonTestimonial({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 min-h-[400px] flex flex-col justify-center", className)} {...props}>
      <div className="flex justify-center mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonShimmer key={i} className="h-6 w-6 rounded mx-1" />
        ))}
      </div>
      <SkeletonText lines={4} className="mb-8 text-center" />
      <div className="flex items-center justify-center gap-6">
        <SkeletonShimmer className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <SkeletonShimmer className="h-6 w-32 rounded" />
          <SkeletonShimmer className="h-4 w-24 rounded" />
        </div>
      </div>
    </div>
  )
}

// Project case study skeleton
function SkeletonProjectCaseStudy({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-h-screen bg-white", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Left Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-8">
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonShimmer className="h-4 w-24 rounded" />
                    <SkeletonShimmer className="h-6 w-32 rounded" />
                  </div>
                ))}
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <SkeletonShimmer className="h-4 w-32 rounded" />
                  <div className="flex gap-3">
                    <SkeletonShimmer className="h-8 w-8 rounded-full" />
                    <SkeletonShimmer className="h-8 w-8 rounded-full" />
                    <SkeletonShimmer className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-6">
              <SkeletonShimmer className="h-12 w-3/4 rounded" />
              <SkeletonShimmer className="h-8 w-full rounded" />
              <SkeletonShimmer className="h-8 w-5/6 rounded" />
            </div>
            <SkeletonShimmer className="aspect-video w-full rounded-3xl" />
            <div className="space-y-4">
              <SkeletonText lines={6} />
              <SkeletonText lines={5} />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <SkeletonShimmer className="h-6 w-32 rounded" />
                  <SkeletonText lines={3} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  SkeletonShimmer,
  SkeletonText,
  SkeletonImage,
  SkeletonCard,
  SkeletonBlogPost,
  SkeletonFeaturedPost,
  SkeletonProjectCard,
  SkeletonArticleContent,
  SkeletonJobListing,
  SkeletonTestimonial,
  SkeletonProjectCaseStudy,
}

