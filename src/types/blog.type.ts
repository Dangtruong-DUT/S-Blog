export interface Blog {
    id: string
    featured_image: string
    content: string
    title: string
    subtitle: string
    author_id: string
    created_at: string
    updated_at: string
    category: string
    likes_count: number
    watch_count: number
    is_liked?: boolean
}

export interface BlogList {
    blogs: Blog[]
    pagination: {
        page: number
        limit: number
        total_pages: number //
    }
}

export interface BlogListQueryConfig {
    page?: number | string
    limit?: number | string
    sort_by?: 'createdAt' | 'view' | 'like'
    order?: 'asc' | 'desc'
    exclude?: string
    author?: string
    category?: string
    liked?: boolean
}

export interface Categories {
    categories: category[]
}

export interface category {
    id: string
    name: string
}

export type CreateBlogReqBody = Omit<
    Blog,
    'id' | 'url' | 'author_id' | 'created_at' | 'updated_at' | 'likes_count' | 'watch_count' | 'is_liked'
> & {
    status: 'draft' | 'published'
}

export type UpdateBlogReqBody = Omit<
    Blog,
    'id' | 'url' | 'author_id' | 'created_at' | 'updated_at' | 'likes_count' | 'watch_count' | 'is_liked'
> & {
    status: 'draft' | 'published'
}
