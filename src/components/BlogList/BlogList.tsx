import classNames from 'classnames/bind'
import styles from './BlogList.module.scss'
import Pagination from '../Pagination'
import BlogCart from '../BlogCart'
import { BlogListQueryConfig } from 'src/types/blog.type'
import blogApi from 'src/apis/blog.api'
import { useQuery } from '@tanstack/react-query'
import SkeletonBlogCart from '../Skeleton'

const cx = classNames.bind(styles)

interface BlogListProps {
    queryKey: string
    queryConfig: BlogListQueryConfig
    path: string
}
function BlogList({ queryKey, queryConfig, path }: BlogListProps) {
    const { data, isLoading } = useQuery({
        queryKey: [queryKey, queryConfig],
        queryFn: () => {
            return blogApi.getBlogs(queryConfig as BlogListQueryConfig)
        }
    })
    const category = queryConfig.category == undefined ? 'ALL POST' : queryConfig.category
    return (
        <div className={cx('blogsWrapper')}>
            <span className={cx('blogsLabel')}>{category}</span>
            <div className={cx('blogListGrid')}>
                {!isLoading && data && (
                    <>
                        {data.data.data.Blogs.map((element) => (
                            <BlogCart blog={element} key={element.id} />
                        ))}
                        <Pagination
                            queryConfig={queryConfig}
                            pageSize={data.data.data.pagination.page_size}
                            path={path}
                        />
                    </>
                )}
                {(isLoading || !data) && (
                    <>
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                    </>
                )}
            </div>
        </div>
    )
}

export default BlogList
