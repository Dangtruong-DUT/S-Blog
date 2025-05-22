import classNames from 'classnames/bind'
import styles from './BlogList.module.scss'
import Pagination from '../Pagination'
import { BlogListQueryConfig } from 'src/types/blog.type'
import blogApi from 'src/apis/blog.api'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import SkeletonBlogCard from '../Skeleton'
import BlogCard from '../BlogCard'

const cx = classNames.bind(styles)

interface BlogListProps {
    queryKey: string
    queryConfig: BlogListQueryConfig
    path: string
}

function BlogList({ queryKey, queryConfig, path }: BlogListProps) {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: [queryKey, queryConfig],
        queryFn: () => blogApi.getBlogs(queryConfig)
    })
    const { category: categoryName } = useParams()
    const category = categoryName || 'ALL POST'
    const blogList = data?.data.data.blogs || []
    const totalPages = data?.data.data.pagination.total_pages || 0

    const renderBlogs = useCallback(
        () => blogList.map((blog) => <BlogCard blog={blog} key={blog.id} />),
        [isFetching, isLoading]
    )

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
