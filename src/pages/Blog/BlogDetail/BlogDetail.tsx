import SEO from 'src/components/SeoHelmet'
import SkeletonBlogDetail from './components/SkeletonBlogDetail'
import styles from './BlogDetail.module.scss'
import classNames from 'classnames/bind'
import BlogHeader from './components/BlogHeader'
import BlogSidebar from './components/BlogSidebar'
import BlogContent from './components/BlogContent'
import BlogActions from './components/BlogActions'
import { useBlogDetail } from 'src/hooks/useBlogDetail'
import useLikeBlog from 'src/hooks/useLikeBlog'
import { useCallback, useContext } from 'react'
import Comments from 'src/components/Comments/Comments'
import { AppContext } from 'src/contexts/app.context'

const cx = classNames.bind(styles)

export default function BlogDetail() {
    const { blog, isLoading, contentHtml, socialLinks, id, refetch } = useBlogDetail()
    const { handleLikeBlog } = useLikeBlog({ id })
    const { profile } = useContext(AppContext)

    const handleLike = useCallback(() => {
        handleLikeBlog({
            onSuccess: () => {
                refetch()
            },
            onError: () => {
                refetch()
            }
        })
    }, [handleLikeBlog, refetch])

    if (isLoading && !blog) return <SkeletonBlogDetail />

    if (!blog) return null

    return (
        <section className={cx('blog-detail')}>
            <SEO
                description={blog.subtitle}
                title={blog.subtitle}
                path={id}
                image='https://vione.ai/wp-content/uploads/2022/03/tri-tue-nhan-tao.jpg'
                type='article'
            />
            <BlogHeader blogId={id} title={blog.title} subtitle={blog.subtitle} authorId={blog.author_id} />
            <div className={cx('blogDetail__contentWrapper')}>
                <BlogSidebar social={socialLinks} />
                <BlogContent html={contentHtml} />
                <BlogActions
                    likes={blog.likes_count}
                    views={blog.watch_count}
                    isLiked={blog.is_liked}
                    handleLike={handleLike}
                />
            </div>
            <div className={cx('blogDetail__comments')}>
                <Comments
                    postId={Number(id)}
                    currentUser={
                        profile
                            ? {
                                  id: Number(profile.id),
                                  fullName: `${profile.first_name} ${profile.last_name}`,
                                  avatar: profile.avatar || ''
                              }
                            : undefined
                    }
                    postAuthorId={Number(blog.author_id)}
                />
            </div>
        </section>
    )
}
