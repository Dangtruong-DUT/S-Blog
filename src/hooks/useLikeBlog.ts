import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import blogApi from 'src/apis/blog.api'
import { Blog } from 'src/types/blog.type'
import { ResponseApi } from 'src/types/utils.type'

interface LikeBlogProps {
    id: string
}

interface CallbackProps {
    onSuccess?: (res: AxiosResponse<ResponseApi<Blog>, any>) => void
    onError?: (error: Error) => void
}

function useLikeBlog({ id }: LikeBlogProps) {
    const { mutate: likeBlogMutate, isPending } = useMutation({
        mutationFn: blogApi.likeBlog
    })

    const handleLikeBlog = useCallback(
        ({ onError, onSuccess }: CallbackProps) => {
            likeBlogMutate(id, {
                onSuccess: (res) => {
                    onSuccess?.(res)
                },
                onError: (error) => {
                    onError?.(error)
                }
            })
        },
        [id]
    )

    return {
        handleLikeBlog,
        isPending
    }
}

export default useLikeBlog
