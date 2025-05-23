import React, { useMemo, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import commentApi from 'src/apis/comment.api'
import { Comment as APIComment, AddCommentPayload } from 'src/types/comment.type'

interface CommentsProps {
    postAuthorId: number
    postId: number
    currentUser?: {
        id: number
        fullName: string
        avatar: string
    }
}

interface SectionComment {
    userId: string
    comId: string
    fullName: string
    displayName: React.ReactNode
    avatarUrl: string
    text: string
    timestamp: string
    userProfile: string
    replies: SectionComment[]
    parentOfRepliedComment?: string
    user: APIComment['user']
    isAuthor?: boolean
}

function mapCommentsToSection(
    comments: APIComment[],
    usersMap: Record<number, APIComment['user']>,
    parentLevel = 0,
    postAuthorId: number
): SectionComment[] {
    return comments.map((c: APIComment) => {
        const isSecondLevel = parentLevel === 1
        const isAuthor = c.user.id == postAuthorId

        return {
            userId: String(c.user.id),
            comId: String(c.id),
            fullName: `${c.user.first_name} ${c.user.last_name} ${isAuthor && '• author'} `,
            displayName: (
                <>
                    {c.user.first_name} {c.user.last_name}
                </>
            ),
            avatarUrl: c.user.avatar,
            text: c.content,
            timestamp: c.created_at,
            userProfile: `/@${c.user.id}`,
            replies: isSecondLevel
                ? []
                : c.replies
                  ? mapCommentsToSection(c.replies, usersMap, parentLevel + 1, postAuthorId)
                  : [],
            parentOfRepliedComment: c.parent ? String(c.parent) : undefined,
            user: c.user,
            isAuthor
        }
    })
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

    const usersMap = useMemo(() => {
        const map: Record<number, APIComment['user']> = {}
        data.forEach((c: APIComment) => {
            map[c.user.id] = c.user
            c.replies?.forEach((r: APIComment) => {
                map[r.user.id] = r.user
            })
        })
        return map
    }, [data])

    const commentData: SectionComment[] = useMemo(() => {
        return mapCommentsToSection(data, usersMap, 0, postAuthorId)
    }, [data, usersMap, postAuthorId])

    interface CommentActionData {
        parentOfRepliedComment?: string
        text: string
        comId: string
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [CommentSection, setCommentSection] = useState<React.ComponentType<any> | null>(null)

    useEffect(() => {
        // Dynamic import để tránh lỗi require khi build
        import('react-comments-section').then((mod) => {
            import('react-comments-section/dist/index.css')
            setCommentSection(() => mod.CommentSection)
        })
    }, [])

    return (
        CommentSection && (
            <CommentSection
                currentUser={
                    currentUser
                        ? {
                              currentUserId: String(currentUser.id),
                              currentUserImg: currentUser.avatar,
                              currentUserProfile: `/@${currentUser.id}`,
                              currentUserFullName: currentUser.fullName
                          }
                        : null
                }
                logIn={{
                    onLogin: () => (window.location.href = '/auth/login'),
                    signUpLink: '/auth/register'
                }}
                commentData={commentData.map((c) => ({
                    ...c,
                    fullName: typeof c.fullName === 'string' ? c.fullName : `${c.user.first_name} ${c.user.last_name}`
                }))}
                placeHolder={'Viết bình luận...'}
                onSubmitAction={async (data: CommentActionData) => {
                    await addMutation.mutateAsync({ content: data.text, post: postId })
                }}
                onReplyAction={async (data: { repliedToCommentId: string; text: string }) => {
                    await replyMutation.mutateAsync({
                        parentId: Number(data.repliedToCommentId),
                        payload: { content: data.text, post: postId }
                    })
                }}
                onDeleteAction={async (data: { comIdToDelete: string }) => {
                    await deleteMutation.mutateAsync(Number(data.comIdToDelete))
                }}
                currentData={() => {}}
            />
        )
    )
}

export default Comments
