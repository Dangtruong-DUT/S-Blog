import { AddCommentPayload, ReplyCommentPayload, CommentResponse } from '../types/comment.type'
import http from 'src/utils/https.util'

const commentApi = {
    getCommentsByPost(postId: number) {
        return http.get<CommentResponse>(`/comments/by-post/${postId}/`)
    },
    addComment(payload: AddCommentPayload) {
        return http.post<CommentResponse>('/comments/', payload)
    },

    replyComment(parentId: number, payload: Omit<ReplyCommentPayload, 'parent'>) {
        console.log('payload', payload)
        return http.post<CommentResponse>(`/comments/reply/?parent=${parentId}`, payload)
    },
    deleteComment(commentId: number) {
        return http.delete(`/comments/${commentId}/`)
    }
}

export default commentApi
