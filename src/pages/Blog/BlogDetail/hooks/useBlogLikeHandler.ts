import { useCallback } from 'react'
import useLikeBlog from 'src/hooks/useLikeBlog'

export function useBlogLikeHandler(id: string | number, refetch: () => void) {
    const { handleLikeBlog } = useLikeBlog({ id: id as string })
    const handleLike = useCallback(() => {
        handleLikeBlog({
            onSuccess: refetch,
            onError: refetch
        })
    }, [handleLikeBlog, refetch])
    return handleLike
}
