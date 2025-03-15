import styles from './BlogList.module.scss'
import classNames from 'classnames/bind'
import SearchBar from './components/SearchBar'
import { useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'
import BlogCart from './components/BlogCart'
import SkeletonBlogCart from './components/SkeletonBlogCart'
import { BlogListQueryConfig } from 'src/types/blog.type'
import Pagination from 'src/components/Pagination'
import { routes } from 'src/config'
import useQueryConfig from 'src/hooks/useQueryConfig'

const cx = classNames.bind(styles)

export type QueryConfig = {
    [key in keyof BlogListQueryConfig]: string
}
function BlogList() {
    const queryConfig = useQueryConfig()
    const { data, isLoading } = useQuery({
        queryKey: ['blogs', queryConfig],
        queryFn: () => {
            return blogApi.getBlogs(queryConfig as BlogListQueryConfig)
        }
    })
    console.log(data)

    return (
        <div className={cx('blogListWrapper')}>
            <SearchBar />
            <div className={cx('blogListGrid')}>
                {!isLoading && data && (
                    <>
                        {data.data.data.Blogs.map((element) => (
                            <BlogCart blog={element} key={element.id} />
                        ))}
                        <Pagination
                            queryConfig={queryConfig}
                            pageSize={data.data.data.pagination.page_size}
                            path={routes.blogList}
                        />
                    </>
                )}
                {isLoading && (
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
