import { isUndefined, omitBy } from 'lodash'
import { BlogListQueryConfig } from 'src/types/blog.type'
import classNames from 'classnames/bind'
import styles from './Pagination.module.scss'
import PageItem from './PageItem'
import Dots from './Dots'
import Arrow from './Arrow'

const cx = classNames.bind(styles)

interface Props {
    queryConfig: BlogListQueryConfig
    pageSize: number
    path: string
}

const RANGE = 2

export default function Pagination({ queryConfig, pageSize, path }: Props) {
    const currentPage = Number(queryConfig.page)

    const handleScroll = () => {
        window.scrollTo({ top: 150, behavior: 'smooth' })
    }

    const getFilteredQueryConfig = (): Record<string, string> => {
        return omitBy(
            {
                page: queryConfig.page || '1',
                limit: queryConfig.limit?.toString(),
                sort_by: queryConfig.sort_by,
                author: queryConfig.author,
                category: queryConfig.category,
                exclude: queryConfig.exclude,
                order: queryConfig.order,
                liked: queryConfig.liked?.toString()
            },
            isUndefined
        ) as Record<string, string>
    }

    const filteredQueryConfig = getFilteredQueryConfig()

    const renderPaginationItems = () => {
        let dotBeforeShown = false
        let dotAfterShown = false

        return Array.from({ length: pageSize }, (_, index) => {
            const pageNumber = index + 1

            if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
                if (!dotAfterShown) {
                    dotAfterShown = true
                    return <Dots keyId={index} />
                }
                return null
            }

            if (currentPage > RANGE * 2 + 1 && currentPage < pageSize - RANGE * 2) {
                if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
                    if (!dotBeforeShown) {
                        dotBeforeShown = true
                        return <Dots keyId={index} />
                    }
                    return null
                }
                if (pageNumber > currentPage + RANGE && pageNumber < pageSize - RANGE + 1) {
                    if (!dotAfterShown) {
                        dotAfterShown = true
                        return <Dots keyId={index} />
                    }
                    return null
                }
            }

            if (currentPage >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
                if (!dotBeforeShown) {
                    dotBeforeShown = true
                    return <Dots keyId={index} />
                }
                return null
            }

            return (
                <PageItem
                    key={pageNumber}
                    pageNumber={pageNumber}
                    currentPage={currentPage}
                    path={path}
                    queryParams={filteredQueryConfig}
                    onClick={handleScroll}
                />
            )
        })
    }

    return (
        <div className={cx('pagination')}>
            <Arrow
                direction='prev'
                currentPage={currentPage}
                pageSize={pageSize}
                path={path}
                queryParams={filteredQueryConfig}
                onClick={handleScroll}
            />
            {renderPaginationItems()}
            <Arrow
                direction='next'
                currentPage={currentPage}
                pageSize={pageSize}
                path={path}
                queryParams={filteredQueryConfig}
                onClick={handleScroll}
            />
        </div>
    )
}
