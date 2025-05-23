import { useCallback, useContext, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Blog } from 'src/types/blog.type'
import blogApi from 'src/apis/blog.api'
import { AppContext } from 'src/contexts/app.context'

export function useBlogCard(blog: Blog) {
    const { profile } = useContext(AppContext)
    const queryClient = useQueryClient()

    const [isShowDeleteModal, setShowDeleteModal] = useState(false)

    const isAuthor = profile?.id === blog.author_id

    const deleteMutation = useMutation({
        mutationFn: blogApi.deleteBlog
    })

    const handleDeletePost = useCallback(() => {
        deleteMutation.mutate(blog.id, {
            onSuccess: (res) => {
                toast.success(res.data.message)
                setShowDeleteModal(false)
                queryClient.invalidateQueries({ queryKey: ['blogList'] })
            },
            onError: (err) => {
                toast.error(err.message)
            }
        })
    }, [blog.id, deleteMutation, queryClient])

    const toggleModalDeletePostVisibility = useCallback(() => {
        setShowDeleteModal((prev) => !prev)
    }, [])

    const handleConfirmDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowDeleteModal(true)
    }, [])

    return {
        isAuthor,
        isShowDeleteModal,
        toggleModalDeletePostVisibility,
        handleConfirmDelete,
        handleDeletePost,
        isDeleting: deleteMutation.isPending
    }
}
