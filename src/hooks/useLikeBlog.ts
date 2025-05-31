import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useCallback, useContext } from 'react'
import { toast } from 'react-toastify'
import blogApi from 'src/apis/blog.api'
import { AppContext } from 'src/contexts/app.context'
import { UserMessage } from 'src/constants/Message'
import { Blog } from 'src/types/blog.type'
import { ResponseApi } from 'src/types/utils.type'

interface LikeBlogProps {
    id: string
}

interface CallbackProps {
    onSuccess?: (res: AxiosResponse<ResponseApi<Blog>, unknown>) => void
    onError?: (error: Error) => void
}

function useLikeBlog({ id }: LikeBlogProps) {
    const { isAuthenticated } = useContext(AppContext)
    const { mutate: likeBlogMutate, isPending } = useMutation({
        mutationFn: blogApi.likeBlog
    })

    const handleLikeBlog = useCallback(
        ({ onError, onSuccess }: CallbackProps) => {
            if (!isAuthenticated) {
                toast.warning(UserMessage.LIKE_LOGIN_REQUIRED, { autoClose: 3000 })
                return
            }

            likeBlogMutate(id, {
                onSuccess: (res) => {
                    onSuccess?.(res)
                },
                onError: (error) => {
                    onError?.(error)
                }
            })
        },
        [id, isAuthenticated, likeBlogMutate]
    )

    return {
        handleLikeBlog,
        isPending
    }
}

export default useLikeBlog
