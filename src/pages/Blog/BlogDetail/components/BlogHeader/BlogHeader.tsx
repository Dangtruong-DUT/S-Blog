import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'
import { AppContext } from 'src/contexts/app.context'
import { memo, useCallback, useContext } from 'react'
import styles from './BlogHeader.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface BlogHeaderProps {
    blogId: string
    title: string
    subtitle: string
    authorId: string
}

function BlogHeader({ blogId, title, subtitle, authorId }: BlogHeaderProps) {
    const { profile } = useContext(AppContext)
    const navigate = useNavigate()

    const handleBackScreen = useCallback(() => {
        navigate(-1)
    }, [navigate])

    return (
        <header className={cx('blog-header')}>
            <div className={cx('blog-header__container')}>
                <div className={cx('blog-header__toolbar')}>
                    <button className={cx('blog-header__icon-button')} onClick={handleBackScreen}>
                        <FaArrowLeft size={'2rem'} />
                    </button>
                    {profile?.id === authorId && (
                        <Link to={`/blogs/${blogId}/edit`} className={cx('blog-header__icon-button')}>
                            <AiFillEdit size={'2rem'} />
                        </Link>
                    )}
                </div>
                <h1 className={cx('blog-header__title')}>{title}</h1>
                <h2 className={cx('blog-header__subtitle')}>{subtitle}</h2>
            </div>
        </header>
    )
}

export default memo(BlogHeader)
