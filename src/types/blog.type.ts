export interface Blog {
    id: string
    feature_image: string
    content: string
    title: string
    sub_title: string
    author: string
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
    liked?: boolean
}

export interface Categories {
    categories: category[]
}

export interface category {
    id: string
    name: string
}
