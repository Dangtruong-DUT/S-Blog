// Pagination.tsx
import classNames from 'classnames/bind'
import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfig } from 'src/pages/Blog/BlogsPage/BlogsPage'
import styles from './Pagination.module.scss'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const cx = classNames.bind(styles)

interface Props {
    queryConfig: QueryConfig
    pageSize: number
    path: string
}

const RANGE = 2
export default function Pagination({ queryConfig, pageSize, path }: Props) {
    const handleScroll = () => {
        window.scrollTo({ top: 150, behavior: 'smooth' })
    }
    const page = Number(queryConfig.page)

    const renderPagination = () => {
        let dotAfter = false
        let dotBefore = false

        const renderDotBefore = (index: number) => {
            if (!dotBefore) {
                dotBefore = true
                return (
                    <span key={index} className={cx('dots')}>
                        <span />
                        <span />
                        <span />
                    </span>
                )
            }
            return null
        }

        const renderDotAfter = (index: number) => {
            if (!dotAfter) {
                dotAfter = true
                return (
                    <span key={index} className={cx('dots')}>
                        <span />
                        <span />
                        <span />
                    </span>
                )
            }
            return null
        }

        return Array(pageSize)
            .fill(0)
            .map((_, index) => {
                const pageNumber = index + 1
                if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                    return renderDotAfter(index)
                } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
                    if (pageNumber < page - RANGE && pageNumber > RANGE) {
                        return renderDotBefore(index)
                    } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                        return renderDotAfter(index)
                    }
                } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
                    return renderDotBefore(index)
                }

                return (
                    <Link
                        to={{
                            pathname: path,
                            search: createSearchParams({
                                ...queryConfig,
                                page: pageNumber.toString()
                            }).toString()
                        }}
                        key={index}
                        className={cx('pageItem', { active: pageNumber === page })}
                        onClick={handleScroll}
                    >
                        {pageNumber}
                    </Link>
                )
            })
    }

    return (
        <div className={cx('pagination')}>
            {page === 1 ? (
                <span className={cx('pageItem', 'disabled')}>
                    <FaChevronLeft />
                </span>
            ) : (
                <Link
                    to={{
                        pathname: path,
                        search: createSearchParams({
                            ...queryConfig,
                            page: (page - 1).toString()
                        }).toString()
                    }}
                    className={cx('pageItem')}
                    onClick={handleScroll}
                >
                    <FaChevronLeft />
                </Link>
            )}
            {renderPagination()}
            {page === pageSize ? (
                <span className={cx('pageItem', 'disabled')}>
                    <FaChevronRight />
                </span>
            ) : (
                <Link
                    to={{
                        pathname: path,
                        search: createSearchParams({
                            ...queryConfig,
                            page: (page + 1).toString()
                        }).toString()
                    }}
                    className={cx('pageItem')}
                    onClick={handleScroll}
                >
                    <FaChevronRight />
                </Link>
            )}
        </div>
    )
}
