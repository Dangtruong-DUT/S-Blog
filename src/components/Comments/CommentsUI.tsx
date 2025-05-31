import React, { useState } from 'react'
import { Comment as APIComment, AddCommentPayload } from 'src/types/comment.type'
import { Link } from 'react-router-dom'
import { FaRegEdit, FaRegTrashAlt, FaReply, FaQuoteRight, FaUser } from 'react-icons/fa'
import styles from './Comments.module.scss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// Thêm kiểu mở rộng cho Comment để hỗ trợ parentUser
export interface CommentWithParentUser extends APIComment {
    parentUser?: APIComment['user']
    parentCommentId?: number
}

interface CommentsProps {
    postAuthorId: number
    postId: number
    currentUser?: {
        id: number
        fullName: string
        avatar: string
    }
    comments: APIComment[]
    onAddComment: (payload: AddCommentPayload) => Promise<void>
    onReplyComment: (parentId: number, payload: AddCommentPayload) => Promise<void>
    onDeleteComment: (commentId: number) => Promise<void>
    onEditComment: (commentId: number, content: string) => Promise<void>
}

interface CommentItemProps {
    comment: CommentWithParentUser
    postAuthorId: number
    currentUser?: CommentsProps['currentUser']
    onReply: (parentId: number, text: string) => void
    onDelete: (commentId: number) => void
    onEdit: (commentId: number, content: string) => void
    level?: number
}

interface EditState {
    editing: boolean
    value: string
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    postAuthorId,
    currentUser,
    onReply,
    onDelete,
    onEdit,
    level = 0
}) => {
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [editState, setEditState] = useState<EditState>({ editing: false, value: comment.content })
    const isCurrentUser = currentUser && currentUser.id === comment.user.id
    const isAuthor = comment.user.id === postAuthorId

    return (
        <div className={level === 0 ? styles.comment : styles.comment__reply_list}>
            <img
                src={comment.user.avatar || 'default-avatar.png'}
                alt={`Ảnh đại diện của ${comment.user.first_name || 'người dùng'}`}
                className={styles.comment__avatar}
            />

            <div className={styles.comment__body}>
                <div className={styles.comment__header}>
                    <div className={styles.comment__info}>
                        <Link to={`/@${comment.user.id}`} className={styles.userLink}>
                            <span
                                className={
                                    isAuthor
                                        ? `${styles.comment__name} ${styles.comment__name__author}`
                                        : styles.comment__name
                                }
                            >
                                {comment.user.first_name} {comment.user.last_name}
                            </span>
                        </Link>
                        <span className={styles.comment__time}>
                            {dayjs(comment.created_at).isAfter(dayjs().subtract(7, 'day'))
                                ? dayjs(comment.created_at).fromNow()
                                : dayjs(comment.created_at).format('DD/MM/YYYY HH:mm')}
                        </span>
                    </div>

                    <div className={styles.comment__actions}>
                        {currentUser && (
                            <button
                                className={styles.comment__action_btn}
                                onClick={() => setShowReply(!showReply)}
                                title='Trả lời bình luận'
                            >
                                <FaReply className={styles.comment__icon} />
                                <span>{showReply ? 'Hủy' : 'Trả lời'}</span>
                            </button>
                        )}
                        {isCurrentUser && !editState.editing && (
                            <>
                                <button
                                    className={styles.comment__action_btn}
                                    onClick={() => setEditState({ editing: true, value: comment.content })}
                                    title='Sửa bình luận'
                                >
                                    <FaRegEdit className={styles.comment__icon} />
                                    <span>Sửa</span>
                                </button>
                                <button
                                    className={styles.comment__action_btn}
                                    onClick={() => onDelete(comment.id)}
                                    title='Xóa bình luận'
                                >
                                    <FaRegTrashAlt className={styles.comment__icon} />
                                    <span>Xóa</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {comment.parent && comment.parent !== comment.id && comment.parentUser && (
                    <div className={styles.comment__reply_indicator}>
                        <FaQuoteRight size={12} />
                        <span>
                            Đang trả lời{' '}
                            <Link to={`/@${comment.parentUser.id}`}>
                                {comment.parentUser.first_name} {comment.parentUser.last_name}
                            </Link>
                        </span>
                    </div>
                )}

                <div className={styles.comment__body_content}>
                    {editState.editing ? (
                        <div className={styles.form_edit}>
                            <input
                                value={editState.value}
                                onChange={(e) => setEditState({ ...editState, value: e.target.value })}
                                className={styles.postComment}
                                placeholder='Chỉnh sửa bình luận...'
                                autoFocus
                            />
                            <div>
                                <button
                                    className={styles.postBtn}
                                    onClick={() => {
                                        onEdit(comment.id, editState.value)
                                        setEditState({ editing: false, value: editState.value })
                                    }}
                                    disabled={!editState.value.trim()}
                                >
                                    Lưu
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setEditState({ editing: false, value: comment.content })}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.comment__content}>{comment.content}</div>
                    )}

                    {showReply && (
                        <div className={styles.replysection}>
                            <input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className={styles.postComment}
                                placeholder={`Đang trả lời ${comment.user.first_name}...`}
                                autoFocus
                            />
                            <div>
                                <button
                                    className={styles.postBtn}
                                    onClick={() => {
                                        if (level === 1) {
                                            if (comment.parentCommentId) {
                                                onReply(comment.parentCommentId, replyText)
                                            }
                                        } else {
                                            onReply(comment.id, replyText)
                                        }
                                        setReplyText('')
                                        setShowReply(false)
                                    }}
                                    disabled={!replyText.trim()}
                                >
                                    Gửi
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setShowReply(false)
                                        setReplyText('')
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {level === 0 && comment.replies && comment.replies.length > 0 && (
                    <div>
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postAuthorId={postAuthorId}
                                currentUser={currentUser}
                                onReply={onReply}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const Comments: React.FC<CommentsProps & { onEditComment: (commentId: number, content: string) => Promise<void> }> = ({
    postId,
    postAuthorId,
    currentUser,
    comments,
    onAddComment,
    onReplyComment,
    onDeleteComment,
    onEditComment
}) => {
    // Map parentUser và parentCommentId cho từng comment (2 cấp)
    const mapParentUser = (
        comments: APIComment[],
        parentUser?: APIComment['user'],
        parentCommentId?: number
    ): CommentWithParentUser[] => {
        return comments.map((c) => ({
            ...c,
            parentUser,
            parentCommentId,
            replies: c.replies ? c.replies.map((r) => ({ ...r, parentUser: c.user, parentCommentId: c.id })) : []
        }))
    }

    const commentsWithParentUser = mapParentUser(comments)
    const [text, setText] = useState('')

    const handleAdd = async () => {
        if (text.trim()) {
            await onAddComment({ content: text, post: postId })
            setText('')
        }
    }

    const handleReply = async (parentId: number, replyText: string) => {
        if (replyText.trim()) {
            await onReplyComment(parentId, { content: replyText, post: postId })
        }
    }

    const handleDelete = async (commentId: number) => {
        await onDeleteComment(commentId)
    }

    const handleEdit = async (commentId: number, content: string) => {
        await onEditComment(commentId, content)
    }

    return (
        <div className={styles.comments_wrapper}>
            <h4>Bình luận</h4>{' '}
            {currentUser ? (
                <div className={styles.form}>
                    <img
                        src={currentUser.avatar || 'default-avatar.png'}
                        alt={`Ảnh đại diện của ${currentUser.fullName}`}
                        className={styles.imgdefault}
                    />
                    <div style={{ flex: 1 }}>
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className={styles.postComment}
                            placeholder='Viết bình luận của bạn...'
                        />
                    </div>
                    <button className={styles.postBtn} onClick={handleAdd} disabled={!text.trim()}>
                        Gửi
                    </button>
                </div>
            ) : (
                <div className={styles.login_prompt}>
                    <div style={{ marginBottom: '16px' }}>
                        <FaUser size={32} color='var(--text-dark-gray)' />
                    </div>
                    <span style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Bạn cần đăng nhập để bình luận</span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to='/auth/login' className={styles.postBtn} style={{ textDecoration: 'none' }}>
                            Đăng nhập
                        </Link>
                        <Link
                            to='/auth/register'
                            className={styles.postBtn}
                            style={{ textDecoration: 'none', background: 'var(--color-purple)' }}
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            )}
            <div className={styles['comments-container']}>
                {commentsWithParentUser.length === 0 ? (
                    <div style={{ color: 'var(--text-dark-gray)', textAlign: 'center', margin: '24px 0' }}>
                        Chưa có bình luận nào.
                    </div>
                ) : (
                    commentsWithParentUser.map((comment) => (
                        <div key={comment.id} className={styles['comment-thread']}>
                            <CommentItem
                                comment={comment}
                                postAuthorId={postAuthorId}
                                currentUser={currentUser}
                                onReply={handleReply}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Comments
