import SEO from 'src/components/SeoHelmet'
import SkeletonBlogDetail from './components/SkeletonBlogDetail'
import styles from './BlogDetail.module.scss'
import classNames from 'classnames/bind'
import BlogHeader from './components/BlogHeader'
import BlogSidebar from './components/BlogSidebar'
import BlogContent from './components/BlogContent'
import BlogActions from './components/BlogActions'
import { useBlogDetail } from 'src/hooks/useBlogDetail'

const cx = classNames.bind(styles)

export default function BlogDetail() {
    const { blog, isLoading, contentHtml, socialLinks, id } = useBlogDetail()

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
                <BlogActions likes={blog.likes_count} views={blog.watch_count} />
            </div>
            <div className={cx('blog-detail__comments')}>{/* Future: <Comments /> */}</div>
        </section>
    )
}
