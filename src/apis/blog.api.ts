import {
    Blog,
    BlogList,
    BlogListQueryConfig,
    category,
    CreateBlogReqBody,
    UpdateBlogReqBody
} from 'src/types/blog.type'
import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

const URL = import.meta.env.VITE_API_URL_BLOG
const URL_CATEGORIES = import.meta.env.VITE_API_URL_CATEGORIES

const blogApi = {
    getBlogs(params: BlogListQueryConfig) {
        return http.get<ResponseApi<BlogList>>(`${URL}/`, {
            params
        })
    },
    getBlogDetail(id: string) {
        return http.get<ResponseApi<Blog>>(`${URL}/${id}/`)
    },
    getCategories() {
        return http.get<ResponseApi<category[]>>(URL_CATEGORIES)
    },
    createBlog(body: CreateBlogReqBody) {
        return http.post<ResponseApi<Blog>>(`${URL}/`, body)
    },
    updateBlog(data: { body: UpdateBlogReqBody; id: string }) {
        return http.put<ResponseApi<Blog>>(`${URL}/${data.id}/`, data.body)
    },
    deleteBlog(id: string) {
        return http.delete<ResponseApi<null>>(`${URL}/${id}/`)
    },
    getCategoryById(id: string) {
        return http.get<ResponseApi<category>>(`${URL_CATEGORIES}/${id}/`)
    },
    likeBlog(id: string) {
        return http.post<ResponseApi<Blog>>(`${URL}/${id}/like/`)
    }
}

export default blogApi
