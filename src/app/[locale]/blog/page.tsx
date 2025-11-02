'use client'

import { useBlog } from '@/hooks/useBlog'
import { Blog } from '@/components/Blog'

export default function BlogPage() {
    const {
        blogPosts,
        categories,
        categoryObjects,
        loading,
        error,
        featuredPost,
        regularPosts,
        handleRetry
    } = useBlog()

    return (
        <Blog
            blogPosts={blogPosts}
            categories={categories}
            categoryObjects={categoryObjects}
            loading={loading}
            error={error}
            featuredPost={featuredPost}
            regularPosts={regularPosts}
            handleRetry={handleRetry}
        />
    )
}

