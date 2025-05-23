import classNames from 'classnames/bind'
import { Link, createSearchParams } from 'react-router-dom'
import styles from './Pagination.module.scss'

const cx = classNames.bind(styles)

interface Props {
    pageNumber: number
    currentPage: number
    path: string
    queryParams: Record<string, string>
    onClick?: () => void
}

export default function PageItem({ pageNumber, currentPage, path, queryParams, onClick }: Props) {
    return (
        <Link
            to={{
                pathname: path,
                search: createSearchParams({
                    ...queryParams,
                    page: pageNumber.toString()
                }).toString()
            }}
            className={cx('pageItem', { active: pageNumber === currentPage })}
            onClick={onClick}
        >
            {pageNumber}
        </Link>
    )
}
