import classNames from 'classnames/bind'
import styles from './BlogCart.module.scss'
import { Blog } from 'src/types/blog.type'
import { Link } from 'react-router-dom'
import { generateNameId } from 'src/utils/common.util'
import { routes } from 'src/config'

const cx = classNames.bind(styles)
interface blogCartProps {
    blog: Blog
}
function BlogCart({ blog }: blogCartProps) {
    const handleOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        ;(e.target as HTMLImageElement).src = 'src/assets/images/fallback-image.png'
    }
    return (
        <Link to={`${routes.home}${generateNameId({ name: blog.title, id: blog.id })}`}>
            <article className={cx('BlogCartWrapper')}>
                <div className={cx('featureImageWrapper')}>
                    <img
                        src={blog.featureImage}
                        onError={handleOnError}
                        alt={blog.title}
                        className={cx('blog__image')}
                    />
                </div>
                <h3 className={cx('blog__author')}>
                    BY <strong>{blog.author}</strong> IN
                    <strong>{blog.categories[0]}</strong>
                </h3>
                <h2 className={cx('blog__title')}>{blog.title}</h2>
                <p className={cx('blog__subtitle')}>{blog.subTitle}</p>
            </article>
        </Link>
    )
}

export default BlogCart
