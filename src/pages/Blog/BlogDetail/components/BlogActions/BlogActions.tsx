import { FaHeart, FaEye } from 'react-icons/fa'
import { memo, useState } from 'react'
import styles from './BlogActions.module.scss'
import classNames from 'classnames/bind'
import { formatter } from 'src/utils/common.util'

const cx = classNames.bind(styles)

interface BlogActionsProps {
    likes?: number
    views?: number
}

function BlogActions({ likes = 0, views = 0 }: BlogActionsProps) {
    const [liked, setLiked] = useState(false)

    const handleLikeToggle = () => setLiked((prev) => !prev)

    return (
        <div className={cx('blog-actions')}>
            <div className={cx('blog-actions__item')}>
                <button className={cx('blog-actions__like-btn', { active: liked })} onClick={handleLikeToggle}>
                    <FaHeart size={'2.4rem'} />
                </button>
                {formatter.format(likes)}
            </div>

            <div className={cx('blog-actions__item')}>
                <FaEye size={'2.4rem'} />
                {formatter.format(views)}
            </div>
        </div>
    )
}

export default memo(BlogActions)
