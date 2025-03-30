import { Blog, BlogList, BlogListQueryConfig, Categories } from 'src/types/blog.type'
import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

const URL = 'blogs'
const URL_CATEGORIES = '/api/categories'

const blogApi = {
    getBlogs(params: BlogListQueryConfig) {
        return http.get<ResponseApi<BlogList>>(URL, {
            params
        })
    },
    getBlogDetail(id: string) {
        return http.get<ResponseApi<Blog>>(`${URL}/${id}`)
    },
    getCategories() {
        return http.get<ResponseApi<Categories>>(URL_CATEGORIES)
    },
    createBlog(body: Blog) {
        return http.post<ResponseApi<Blog>>(URL, body)
    },
    updateBlog(data: { body: Blog; id: string }) {
        return http.put<ResponseApi<Blog>>(`${URL}/${data.id}/edit`, data.body)
    },
    deleteBlog(id: string) {
        return http.delete<ResponseApi<null>>(`${URL}/${id}`)
    }
}

export default blogApi
