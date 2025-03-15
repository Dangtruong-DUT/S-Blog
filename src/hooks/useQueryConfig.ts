import { QueryConfig } from 'src/pages/Blog/BlogList/BlogList'
import useQueryParams from './useQueryParams'
import { isUndefined, omitBy } from 'lodash'

function useQueryConfig() {
    const queryParams: QueryConfig = useQueryParams()
    const queryConfig: QueryConfig = omitBy(
        {
            page: queryParams.page || '1',
            limit: queryParams.limit,
            sort_by: queryParams.sort_by,
            author: queryParams.author,
            category: queryParams.category,
            exclude: queryParams.exclude,
            order: queryParams.order
        },
        isUndefined
    )
    return queryConfig
}

export default useQueryConfig
