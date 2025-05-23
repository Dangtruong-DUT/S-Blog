import React, { useState } from 'react'
import { Comment as APIComment, AddCommentPayload } from 'src/types/comment.type'
import { Link } from 'react-router-dom'
import { FaRegEdit, FaRegTrashAlt, FaReply } from 'react-icons/fa'
import './Comments.css'
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
    const isAuthor = comment.user.id === postAuthorId
    const isCurrentUser = currentUser && currentUser.id === comment.user.id
    return (
        <div
            className={level === 0 ? 'comment' : 'comment__reply-list'}
            style={level === 0 ? { alignItems: 'flex-start' } : { paddingLeft: 24 }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                <img
                    src={comment.user.avatar}
                    alt='avatar'
                    className='comment__avatar'
                    style={{
                        minWidth: 40,
                        minHeight: 40,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-blue)',
                        marginTop: 2
                    }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <Link
                            to={`/@${comment.user.id}`}
                            className='userLink'
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            <span className='comment__name'>
                                {comment.user.first_name} {comment.user.last_name}
                            </span>
                            {isAuthor && (
                                <span
                                    className='comment__name--author'
                                    style={{
                                        color: 'var(--color-blue)',
                                        fontWeight: 600,
                                        fontSize: '1.2rem'
                                    }}
                                ></span>
                            )}
                        </Link>
                        <span className='comment__time'>
                            {dayjs(comment.created_at).isAfter(dayjs().subtract(7, 'day'))
                                ? dayjs(comment.created_at).fromNow()
                                : dayjs(comment.created_at).format('DD/MM/YYYY HH:mm')}
                        </span>
                    </div>
                    {comment.parent && comment.parent !== comment.id && comment.parentUser && (
                        <span className='comment__replying'>
                            Đang trả lời{' '}
                            <Link to={`/@${comment.parentUser.id}`}>
                                {comment.parentUser.first_name} {comment.parentUser.last_name}
                            </Link>
                        </span>
                    )}
                    <div className='comment__body' style={{ marginTop: 4 }}>
                        {editState.editing ? (
                            <div
                                className='form'
                                style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <input
                                    value={editState.value}
                                    onChange={(e) => setEditState({ ...editState, value: e.target.value })}
                                    className='postComment comment-form__input'
                                    placeholder='Chỉnh sửa bình luận...'
                                    style={{
                                        fontSize: '1.5rem',
                                        borderRadius: 10,
                                        background: 'var(--background-secondary)',
                                        padding: '10px 16px',
                                        border: '1px solid var(--border-cl)',
                                        flex: 1,
                                        marginRight: 8,
                                        marginLeft: 0
                                    }}
                                />
                                <button
                                    className='postBtn comment-form__btn'
                                    style={{ marginRight: 4 }}
                                    onClick={() => {
                                        onEdit(comment.id, editState.value)
                                        setEditState({ editing: false, value: editState.value })
                                    }}
                                    disabled={!editState.value.trim()}
                                >
                                    Lưu
                                </button>
                                <button
                                    className='cancelBtn'
                                    style={{ marginLeft: 0 }}
                                    onClick={() => setEditState({ editing: false, value: comment.content })}
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <span className='comment__content' style={{ marginLeft: 0 }}>
                                {comment.content}
                            </span>
                        )}
                        <div className='comment__actions' style={{ gap: 6 }}>
                            {currentUser && (
                                <button
                                    className='comment__action-btn'
                                    onClick={() => setShowReply(!showReply)}
                                    title='Trả lời'
                                >
                                    <FaReply className='comment__icon' /> {showReply ? 'Hủy' : 'Trả lời'}
                                </button>
                            )}
                            {isCurrentUser && !editState.editing && (
                                <>
                                    <button
                                        className='comment__action-btn'
                                        style={{ marginLeft: 0 }}
                                        onClick={() => setEditState({ editing: true, value: comment.content })}
                                        title='Sửa'
                                    >
                                        <FaRegEdit className='comment__icon' /> Sửa
                                    </button>
                                    <button
                                        className='comment__action-btn'
                                        style={{ marginLeft: 0 }}
                                        onClick={() => onDelete(comment.id)}
                                        title='Xóa'
                                    >
                                        <FaRegTrashAlt className='comment__icon' /> Xóa
                                    </button>
                                </>
                            )}
                        </div>
                        {showReply && (
                            <div
                                className='replysection'
                                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}
                            >
                                <input
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className='postComment comment-form__input'
                                    placeholder='Nhập phản hồi...'
                                    style={{
                                        fontSize: '1.5rem',
                                        borderRadius: 10,
                                        background: 'var(--background-secondary)',
                                        padding: '10px 16px',
                                        border: '1px solid var(--border-cl)',
                                        flex: 1,
                                        marginRight: 8,
                                        marginLeft: 0
                                    }}
                                />
                                <button
                                    className='postBtn comment-form__btn'
                                    style={{ marginRight: 4 }}
                                    onClick={() => {
                                        if (level === 1) {
                                            // Luôn dùng parentCommentId (id của comment cha cấp 0) để reply, không cho phép reply sâu hơn 2 cấp
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
                                    className='cancelBtn'
                                    style={{ marginLeft: 0 }}
                                    onClick={() => {
                                        setShowReply(false)
                                        setReplyText('')
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        )}
                        {/* Render replies chỉ tối đa 1 cấp con, không lồng sâu hơn */}
                        {level === 0 &&
                            comment.replies &&
                            comment.replies.length > 0 &&
                            comment.replies.map((reply) => (
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
                </div>
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
        <div className='comments-wrapper'>
            <h4>Bình luận</h4>
            {currentUser ? (
                <div
                    className='form'
                    style={{
                        marginBottom: 16,
                        alignItems: 'center',
                        background: 'var(--background-input)',
                        borderRadius: 14,
                        border: '1px solid var(--border-cl)',
                        boxShadow: '0 2px 8px var(--box-shadow-color)',
                        padding: '14px 18px',
                        display: 'flex',
                        gap: 14
                    }}
                >
                    <img
                        src={currentUser.avatar}
                        alt='avatar'
                        className='imgdefault'
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--color-blue)',
                            marginRight: 14,
                            boxShadow: '0 2px 8px var(--box-shadow-color)'
                        }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--primary-text-cl)' }}>
                                {currentUser.fullName}
                            </span>
                        </div>
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className='postComment comment-form__input'
                            placeholder='Viết bình luận của bạn...'
                            style={{
                                fontSize: '1.6rem',
                                borderRadius: 10,
                                background: 'var(--background-secondary)',
                                padding: '12px 18px',
                                border: '1px solid var(--border-cl)',
                                width: '100%',
                                boxShadow: '0 1px 4px var(--box-shadow-color)'
                            }}
                        />
                    </div>
                    <button
                        className='postBtn comment-form__btn'
                        style={{
                            fontSize: '1.5rem',
                            borderRadius: 10,
                            padding: '12px 22px',
                            marginLeft: 10,
                            fontWeight: 600,
                            boxShadow: '0 2px 8px var(--box-shadow-color)'
                        }}
                        onClick={handleAdd}
                        disabled={!text.trim()}
                    >
                        Gửi
                    </button>
                </div>
            ) : (
                <div
                    className='form'
                    style={{
                        marginBottom: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--background-input)',
                        borderRadius: 18,
                        border: '1px solid var(--border-cl)',
                        boxShadow: '0 4px 16px var(--box-shadow-color)',
                        padding: '36px 0 28px 0',
                        minHeight: 180,
                        gap: 18
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <svg width='48' height='48' fill='none' viewBox='0 0 24 24'>
                            <circle cx='12' cy='8' r='4' fill='#bdbdbd' />
                            <rect x='4' y='16' width='16' height='6' rx='3' fill='#e0e0e0' />
                        </svg>
                        <span
                            style={{
                                fontSize: '1.6rem',
                                color: 'var(--text-dark-gray)',
                                fontWeight: 500,
                                marginTop: 4
                            }}
                        >
                            Bạn cần đăng nhập để bình luận
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
                        <Link
                            to='/auth/login'
                            className='postBtn comment-form__btn'
                            style={{
                                textDecoration: 'none',
                                fontSize: '1.5rem',
                                borderRadius: 12,
                                padding: '12px 32px',
                                background: 'var(--color-blue)',
                                color: '#fff',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px var(--box-shadow-color)',
                                transition: 'transform 0.1s',
                                display: 'inline-block'
                            }}
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to='/auth/register'
                            className='postBtn comment-form__btn'
                            style={{
                                textDecoration: 'none',
                                fontSize: '1.5rem',
                                borderRadius: 12,
                                padding: '12px 32px',
                                background: 'var(--color-purple)',
                                color: '#fff',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px var(--box-shadow-color)',
                                transition: 'transform 0.1s',
                                display: 'inline-block'
                            }}
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            )}
            <div>
                {commentsWithParentUser.length === 0 && (
                    <div style={{ color: '#888', textAlign: 'center', margin: '24px 0' }}>Chưa có bình luận nào.</div>
                )}
                {commentsWithParentUser.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postAuthorId={postAuthorId}
                        currentUser={currentUser}
                        onReply={handleReply}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>
        </div>
    )
}

export default Comments
