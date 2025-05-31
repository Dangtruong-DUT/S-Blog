import classNames from 'classnames/bind'
import styles from './BlogList.module.scss'
import Pagination from '../Pagination'
import { BlogListQueryConfig } from 'src/types/blog.type'
import blogApi from 'src/apis/blog.api'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import BlogCard from '../BlogCard'
import { SkeletonBlogCard } from '../Skeleton'
import { useMemo } from 'react'

const cx = classNames.bind(styles)

interface BlogListProps {
    queryKey: string
    queryConfig: BlogListQueryConfig
    path: string
}

function BlogList({ queryKey, queryConfig, path }: BlogListProps) {
    const { data, isLoading } = useQuery({
        queryKey: [queryKey, queryConfig],
        queryFn: () => blogApi.getBlogs(queryConfig),
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
    const { category: categoryName } = useParams()
    const category = categoryName || 'ALL POST'

    const blogList = useMemo(() => data?.data.data.blogs || [], [data])
    const totalPages = data?.data.data.pagination.total_pages || 0

    const renderBlogs = useCallback(() => blogList.map((blog) => <BlogCard blog={blog} key={blog.id} />), [blogList])

    const renderSkeletons = useCallback(
        () => Array.from({ length: 5 }).map((_, index) => <SkeletonBlogCard key={index} />),
        []
    )

    return (
        <div className={cx('blogsWrapper')}>
            <span className={cx('blogsLabel')}>{category}</span>
            <div className={cx('blogListGrid')}>
                {isLoading || !data ? renderSkeletons() : renderBlogs()}
                {!isLoading && data && <Pagination queryConfig={queryConfig} pageSize={totalPages} path={path} />}
            </div>
        </div>
    )
}

export default BlogList
