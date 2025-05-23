import classNames from 'classnames/bind'
import styles from './Blogs.module.scss'
import { BlogList, BlogListQueryConfig } from 'src/types/blog.type'
import blogApi from 'src/apis/blog.api'
import { InfiniteData, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import BlogCard from 'src/components/BlogCard'
import { SkeletonBlogCard } from 'src/components/Skeleton'
import { useEffect, useRef, useState } from 'react'
import Button from 'src/components/Button'
import { ResponseApi } from 'src/types/utils.type'
import { RiLoader2Line } from 'react-icons/ri'
import EmptyState from 'src/components/EmptyState'
import emptyDocument from 'src/assets/animations/document_empty.json'

const cx = classNames.bind(styles)

interface BlogListProps {
    queryKey: string
    queryConfig: BlogListQueryConfig
}

function InfiniteScrollBlog({ queryKey, queryConfig }: BlogListProps) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const lastItemRef = useRef<HTMLDivElement | null>(null)
    const [isManualLoad, setIsManualLoad] = useState<boolean>(false)

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
        ResponseApi<BlogList>,
        Error,
        InfiniteData<ResponseApi<BlogList>, number>
    >({
        queryKey: [queryKey, queryConfig],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await blogApi.getBlogs({ ...queryConfig, page: String(pageParam) })
            return response.data
        },
        getNextPageParam: (lastPage) => {
            const { page, total_pages } = lastPage.data.pagination
            return page < total_pages ? page + 1 : undefined
        },
        initialPageParam: 1,
        placeholderData: keepPreviousData,
        staleTime: 300000
    })

    useEffect(() => {
        if (!isManualLoad || !hasNextPage || !lastItemRef.current) return

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchNextPage()
                }
            },
            { root: null, rootMargin: '100px', threshold: 0.1 }
        )

        const currentRef = lastItemRef.current
        observerRef.current.observe(currentRef)

        return () => {
            observerRef.current?.disconnect()
        }
    }, [hasNextPage, fetchNextPage, isManualLoad])

    const allBlogs = data?.pages.flatMap((page) => page.data.blogs) || []
    const isEmpty = !isLoading && allBlogs.length === 0

    return (
        <div className={cx('blogsWrapper')}>
            {isEmpty ? (
                <EmptyState animationData={emptyDocument} message='Không có bài viết nào' />
            ) : (
                <div className={cx('blogListGrid')}>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => <SkeletonBlogCard key={index} />)
                    ) : (
                        <>
                            {allBlogs.map((blog) => (
                                <BlogCard blog={blog} key={blog.id} />
                            ))}
                            <div ref={lastItemRef} />
                        </>
                    )}
                </div>
            )}

            {hasNextPage && !isManualLoad && !isLoading && (
                <Button
                    variant='primary'
                    outline
                    onClick={() => setIsManualLoad(true)}
                    className={cx('button-load-more')}
                >
                    Load More
                </Button>
            )}

            {isFetchingNextPage && (
                <div className={cx('loadingWrapper')}>
                    <span className={cx('loadingIcon')}>
                        <RiLoader2Line size={'3rem'} />
                    </span>
                </div>
            )}
        </div>
    )
}

export default InfiniteScrollBlog
