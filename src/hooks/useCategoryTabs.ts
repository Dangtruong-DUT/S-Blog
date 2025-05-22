import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import blogApi from 'src/apis/blog.api'

export default function useCategoryTabs() {
    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: blogApi.getCategories
    })

    const categories = useMemo(() => {
        const fetchedCategories = data?.data?.data || []
        return [{ id: '-1', name: 'All' }, ...fetchedCategories]
    }, [data])

    return {
        categories,
        isLoading
    }
}
