import { Blog } from './blog.type'
import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type SearchResponse = ResponseApi<{
    users: User[]
    posts: Blog[]
}>
