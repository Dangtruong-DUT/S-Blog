import { useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'

export default function useBlogCategory(categoryId: string) {
    const { data } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => blogApi.getCategoryById(categoryId),
        enabled: !!categoryId
    })

    return {
        categoryData: data?.data.data
    }
}
