import { SearchResponse } from 'src/types/search.type'
import http from 'src/utils/https.util'

const URL_SEARCH = import.meta.env.VITE_API_URL_SEARCH

const searchApi = {
    searchAll(params: { q: string; type: 'less' | 'more' }) {
        return http.get<SearchResponse>(URL_SEARCH, {
            params
        })
    }
}

export default searchApi
