import SEO from 'src/components/SeoHelmet'
import SkeletonBlogDetail from './components/SkeletonBlogDetail'
import styles from './BlogDetail.module.scss'
import classNames from 'classnames/bind'
import BlogHeader from './components/BlogHeader'
import BlogSidebar from './components/BlogSidebar'
import BlogContent from './components/BlogContent'
import BlogActions from './components/BlogActions'
import { useBlogDetail } from 'src/hooks/useBlogDetail'
import { useContext } from 'react'
import Comments from 'src/components/Comments/Comments'
import { AppContext } from 'src/contexts/app.context'
import BlogDetailLayout from './components/BlogDetailLayout'
import { useBlogLikeHandler } from './hooks/useBlogLikeHandler'

const cx = classNames.bind(styles)

export default function BlogDetail() {
    const { blog, isLoading, contentHtml, socialLinks, id, refetch } = useBlogDetail()
    const handleLike = useBlogLikeHandler(id, refetch)
    const { profile } = useContext(AppContext)

    if (isLoading && !blog) return <SkeletonBlogDetail />

    if (!blog) return null

    const sidebar = (
        <div className={cx('blogDetail__sidebar')}>
            <BlogSidebar social={socialLinks} />
        </div>
    )
    const actions = (
        <div className={cx('blogDetail__actions')}>
            <BlogActions
                likes={blog.likes_count}
                views={blog.watch_count}
                isLiked={blog.is_liked}
                handleLike={handleLike}
            />
        </div>
    )
    const content = <BlogContent html={contentHtml} />
    const comments = (
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
    )
    return (
        <>
            <SEO
                description={blog.subtitle}
                title={blog.subtitle}
                path={id}
                image={blog.featured_image}
                type='article'
            />
            <BlogHeader blogId={id} title={blog.title} subtitle={blog.subtitle} authorId={blog.author_id} />
            <BlogDetailLayout sidebar={sidebar} content={content} actions={actions} comments={comments} />
        </>
    )
}
