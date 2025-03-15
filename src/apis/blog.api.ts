import { Blog, BlogList, BlogListQueryConfig } from 'src/types/blog.type'
import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

const URL = 'blogs'
const blogApi = {
    getBlogs(params: BlogListQueryConfig) {
        return http.get<ResponseApi<BlogList>>(URL, {
            params
        })
    },
    getBlogDetail(id: string) {
        return http.get<ResponseApi<Blog>>(`${URL}/${id}`)
    }
}

export default blogApi
