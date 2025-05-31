import { FaHeart, FaEye } from 'react-icons/fa'
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from './BlogActions.module.scss'
import classNames from 'classnames/bind'
import { formatter } from 'src/utils/common.util'
import useDebounce from 'src/hooks/useDebounce'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { UserMessage } from 'src/constants/Message'

const cx = classNames.bind(styles)

interface BlogActionsProps {
    likes?: number
    views?: number
    handleLike?: () => void
    isLiked?: boolean
}

function BlogActions({ likes = 0, views = 0, handleLike, isLiked = false }: BlogActionsProps) {
    const { isAuthenticated } = useContext(AppContext)
    const [localLiked, setLocalLiked] = useState(isLiked)
    const [localLikes, setLocalLikes] = useState(likes)

    const debouncedLiked = useDebounce({ value: localLiked, delay: 500 })
    const previousDebouncedLiked = useRef<boolean>(debouncedLiked)

    useEffect(() => {
        if (debouncedLiked !== previousDebouncedLiked.current) {
            previousDebouncedLiked.current = debouncedLiked

            if (debouncedLiked !== isLiked && handleLike) {
                handleLike()
            }
        }
    }, [debouncedLiked, isLiked, handleLike])

    const onLikeClick = useCallback(() => {
        if (!isAuthenticated) {
            toast.warning(UserMessage.LIKE_LOGIN_REQUIRED, { autoClose: 3000 })
            return
        }

        const newLiked = !localLiked
        setLocalLiked(newLiked)
        setLocalLikes((prev) => prev + (newLiked ? 1 : -1))
    }, [localLiked, isAuthenticated])

    return (
        <div className={cx('blog-actions')}>
            <div className={cx('blog-actions__item')}>
                <button className={cx('blog-actions__like-btn', { active: localLiked })} onClick={onLikeClick}>
                    <FaHeart size={'2.4rem'} />
                </button>
                {formatter.format(localLikes)}
            </div>

            <div className={cx('blog-actions__item')}>
                <FaEye size={'2.4rem'} />
                {formatter.format(views)}
            </div>
        </div>
    )
}

export default memo(BlogActions)
