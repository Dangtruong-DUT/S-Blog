import classNames from 'classnames/bind'
import styles from './Blogs.module.scss'
import { BlogList, BlogListQueryConfig } from 'src/types/blog.type'
import blogApi from 'src/apis/blog.api'
import { InfiniteData, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import BlogCart from 'src/components/BlogCart'
import SkeletonBlogCart from 'src/components/Skeleton'
import { useEffect, useRef, useState } from 'react'
import Button from 'src/components/Button'
import { ResponseApi } from 'src/types/utils.type'
import { RiLoader2Line } from 'react-icons/ri'

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
        queryFn: async ({ pageParam }) => {
            const response = await blogApi.getBlogs({ ...queryConfig, page: pageParam as string })
            return response.data
        },
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.pagination.page
            const pageSize = lastPage.data.pagination.page_size
            const nextPage = currentPage < pageSize ? currentPage + 1 : undefined
            return nextPage
        },
        initialPageParam: 1,
        placeholderData: keepPreviousData,
        staleTime: 300000
    })
    useEffect(() => {
        if (!isManualLoad || !hasNextPage) return
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage()
                    console.log('load next page')
                }
            },
            { root: null, rootMargin: '100px', threshold: 0.1 }
        )

        if (lastItemRef.current) observerRef.current.observe(lastItemRef.current)

        return () => observerRef.current?.disconnect()
    }, [hasNextPage, fetchNextPage, isManualLoad])

    return (
        <div className={cx('blogsWrapper')}>
            <div className={cx('blogListGrid')}>
                {isLoading ? (
                    <>
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                        <SkeletonBlogCart />
                    </>
                ) : (
                    <>
                        {data?.pages.map((page) =>
                            page.data.Blogs.map((element) => <BlogCart blog={element} key={element.id} />)
                        )}
                        <div ref={lastItemRef}></div>
                    </>
                )}
            </div>
            {hasNextPage && !isManualLoad && (
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
