export interface User {
    id: string
    username: string
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
    followers: number
    likes: number
    isFollowing?: boolean
}
