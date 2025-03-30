import { useQuery } from '@tanstack/react-query'
import styles from './BlogDetail.module.scss'
import classNames from 'classnames/bind'
import { useContext, useMemo, useState } from 'react'
import { FaFacebookF, FaTwitter, FaHeart, FaEye, FaTelegramPlane, FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatter, getIdFromNameId } from 'src/utils/common.util'
import blogApi from 'src/apis/blog.api'
import SkeletonBlogDetail from './components/SkeletonBlogDetail'
import SEO from 'src/components/SeoHelmet'
import createSocialLink from 'src/utils/socialLink'
import { convertToHtml } from 'src/utils/convertQuillToHTML'
import hljs from 'highlight.js'
import { DeltaStatic } from 'quill'
import { AiFillEdit } from 'react-icons/ai'
import { AppContext } from 'src/contexts/app.context'
import Comments from 'src/components/Comments'
const cx = classNames.bind(styles)

function BlogDetail() {
    const navigate = useNavigate()
    const profile = useContext(AppContext)
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

    const getContentHtml = useMemo(() => {
        if (blog?.content) {
            hljs.highlightAll()
            try {
                const delta = JSON.parse(blog.content) as DeltaStatic
                return convertToHtml(delta)
            } catch (err) {
                console.log('Error on converting JSON to HTML', err)
                return `<p style="color: #d32f2f; font-weight: bold;">
                        *An error occurred while displaying the content. We sincerely apologize for this issue.
                    </p>`
            }
        }
        return ''
    }, [blog?.content])

    const handleBackScreen = () => {
        navigate(-1)
    }

    return (
        <section className={cx('blog-detail')}>
            {blog && !isLoading && (
                <>
                    <SEO
                        description={blog.sub_title}
                        title={blog.sub_title}
                        path={nameId as string}
                        image='https://vione.ai/wp-content/uploads/2022/03/tri-tue-nhan-tao.jpg'
                        type='article'
                    />
                    <header className={cx('blog-detail__header')}>
                        <div className={cx('blog-header-inner')}>
                            <div className={cx('blog-header__toolbar')}>
                                <button className={cx('blog-header__toolbar-icon')} onClick={handleBackScreen}>
                                    <FaArrowLeft size={'2rem'} />
                                </button>
                                {blog.author == profile.profile?.username && (
                                    <Link to={`/blogs/${id}/edit`} className={cx('blog-header__toolbar-icon')}>
                                        <AiFillEdit size={'2rem'} />
                                    </Link>
                                )}
                            </div>
                            <h1 className={cx('blog-detail__header-title')}>{blog.title}</h1>
                            <h2 className={cx('blog-detail__header-subtitle')}>{blog.sub_title}</h2>
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
                                <FaTelegramPlane size={'2rem'} />
                            </a>
                        </aside>

                        <div
                            dangerouslySetInnerHTML={{ __html: getContentHtml }}
                            className={cx('previewContent', 'ql-editor htmlConverter', 'blog-detail__content')}
                        ></div>

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
                    <div className={cx('blog-detail__comments')}>{/* <Comments /> */}</div>
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
