export interface User {
    id: string
    email: string
    first_name?: string
    last_name?: string
    bio?: string
    avatar?: string
    is_active?: boolean
    is_staff?: boolean
    is_superuser?: boolean
    date_joined: string
    social_links?: string[]
    followers_count: number
    total_likes: number
    is_following?: boolean
}
