import { useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'

export default function useBlogAuthor(authorId: string) {
    const { data } = useQuery({
        queryKey: [`profile:${authorId}`],
        queryFn: () => userApi.getProfile(authorId),
        enabled: !!authorId
    })

    return {
        userData: data?.data.data
    }
}
