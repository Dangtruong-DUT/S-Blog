export interface Blog {
    id: string
    featureImage: string
    content: string
    title: string
    subTitle: string
    author: string
    slug: string
    created_at: string
    updated_at: string
    categories: string[]
    like: number
    watched: number
}

export interface BlogList {
    Blogs: Blog[]
    pagination: {
        page: number
        limit: number
        page_size: number
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
}
