import { useQuery } from '@tanstack/react-query'
import styles from './BlogDetail.module.scss'
import classNames from 'classnames/bind'
import { useState } from 'react'
import { FaFacebookF, FaTwitter, FaHeart, FaEye, FaTelegram } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { formatter, getIdFromNameId } from 'src/utils/common.util'
import blogApi from 'src/apis/blog.api'
import SkeletonBlogDetail from './components/SkeletonBlogDetail'
import SEO from 'src/components/SeoHelmet'
import createSocialLink from 'src/utils/socialLink'
const cx = classNames.bind(styles)

function BlogDetail() {
    const { nameId } = useParams()
    const id = getIdFromNameId(nameId as string)
    const { data: blogData, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogApi.getBlogDetail(id as string)
    })
    const blog = blogData?.data.data
    const [isLiked, setLiked] = useState<boolean>(false)
    const handleOnClickLike = () => {
        setLiked((prev) => !prev)
    }
    let social
    if (blog) {
        social = createSocialLink({ title: blog?.title, url: nameId as string })
    }
    return (
        <section className={cx('blog-detail')}>
            {blog && !isLoading && (
                <>
                    <SEO
                        description={blog.subTitle}
                        title={blog.subTitle}
                        path={nameId as string}
                        image='https://vione.ai/wp-content/uploads/2022/03/tri-tue-nhan-tao.jpg'
                        type='article'
                    />
                    <header className={cx('blog-detail__header')}>
                        <div className={cx('blog-header-inner')}>
                            <h1 className={cx('blog-detail__header-title')}>{blog.title}</h1>
                            <h2 className={cx('blog-detail__header-subtitle')}>{blog.subTitle}</h2>
                        </div>
                    </header>

                    <div className={cx('blog-detail__content-wrapper')}>
                        <aside className={cx('blog-detail__sidebar')}>
                            <a href={social?.facebook} className={cx('blog-detail__sidebar-item')}>
                                <FaFacebookF size={'2rem'} />
                            </a>
                            <a href={social?.twitter} className={cx('blog-detail__sidebar-item')}>
                                <FaTwitter size={'2rem'} />
                            </a>
                            <a href={social?.telegram} className={cx('blog-detail__sidebar-item')}>
                                <FaTelegram size={'2rem'} />
                            </a>
                        </aside>

                        <div className={cx('blog-detail__content')}>
                            <img
                                src='https://example.com/post1.jpg'
                                alt='Blog Post'
                                className={cx('blog-detail__content-image')}
                            />
                            <p className={cx('blog-detail__content-text')}>{blog.content}</p>
                        </div>

                        <div className={cx('blog-detail__actions')}>
                            <div className={cx('blog-detail__actions-like')}>
                                <button
                                    className={cx('likeBtn', {
                                        active: isLiked
                                    })}
                                    onClick={handleOnClickLike}
                                >
                                    <FaHeart size={'2.4rem'} />
                                </button>
                                {formatter.format(blog.like)}
                            </div>
                            <div className={cx('blog-detail__actions-view')}>
                                <FaEye size={'2.4rem'} />
                                {formatter.format(blog.watched)}
                            </div>
                        </div>
                    </div>

                    <div className={cx('blog-detail__comments')}></div>
                </>
            )}
            {isLoading && !blogData && (
                <>
                    <SkeletonBlogDetail />
                </>
            )}
        </section>
    )
}

export default BlogDetail
