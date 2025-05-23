import { BlogListQueryConfig } from 'src/types/blog.type'
import useQueryParams from './useQueryParams'
import { isUndefined, omitBy } from 'lodash'
import { useParams } from 'react-router-dom'
import useCategoryTabs from './useCategoryTabs'

function useQueryConfig() {
    const { categories } = useCategoryTabs()
    const queryParams: BlogListQueryConfig = useQueryParams()
    const { category } = useParams()
    const categoryId = categories.find((item) => item.name === category)?.id
    const queryConfig: BlogListQueryConfig = omitBy(
        {
            page: queryParams.page || '1',
            limit: queryParams.limit,
            sort_by: queryParams.sort_by,
            author: queryParams.author,
            category: categoryId,
            exclude: queryParams.exclude,
            order: queryParams.order
        },
        isUndefined
    )
    return queryConfig
}

export default useQueryConfig
