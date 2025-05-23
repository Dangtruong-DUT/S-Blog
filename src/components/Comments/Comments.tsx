import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import commentApi from 'src/apis/comment.api'
import { Comment as APIComment, AddCommentPayload } from 'src/types/comment.type'
import CommentsUI from './CommentsUI'

interface CommentsProps {
    postAuthorId: number
    postId: number
    currentUser?: {
        id: number
        fullName: string
        avatar: string
    }
}

const Comments: React.FC<CommentsProps> = ({ postId, currentUser, postAuthorId }) => {
    const queryClient = useQueryClient()
    const { data = [] } = useQuery<APIComment[]>({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const res = await commentApi.getCommentsByPost(postId)
            return res.data.data as APIComment[]
        },
        staleTime: 1000 * 60 * 3
    })

    const addMutation = useMutation({
        mutationFn: (payload: AddCommentPayload) => commentApi.addComment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        }
    })
    const replyMutation = useMutation({
        mutationFn: ({ parentId, payload }: { parentId: number; payload: AddCommentPayload }) =>
            commentApi.replyComment(parentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        }
    })
    const deleteMutation = useMutation({
        mutationFn: (commentId: number) => commentApi.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        }
    })
    const editMutation = useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            commentApi.editComment(commentId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        }
    })

    return (
        <CommentsUI
            postId={postId}
            postAuthorId={postAuthorId}
            currentUser={currentUser}
            comments={data}
            onAddComment={async (payload) => {
                await addMutation.mutateAsync(payload)
            }}
            onReplyComment={async (parentId, payload) => {
                await replyMutation.mutateAsync({ parentId, payload })
            }}
            onDeleteComment={async (commentId) => {
                await deleteMutation.mutateAsync(commentId)
            }}
            onEditComment={async (commentId, content) => {
                await editMutation.mutateAsync({ commentId, content })
            }}
        />
    )
}

export default Comments
