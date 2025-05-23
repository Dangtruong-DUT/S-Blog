import classNames from 'classnames/bind'
import { Link, createSearchParams } from 'react-router-dom'
import styles from './Pagination.module.scss'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const cx = classNames.bind(styles)

interface Props {
    direction: 'prev' | 'next'
    currentPage: number
    pageSize: number
    path: string
    queryParams: Record<string, string>
    onClick?: () => void
}

export default function Arrow({ direction, currentPage, pageSize, path, queryParams, onClick }: Props) {
    const targetPage = direction === 'prev' ? currentPage - 1 : currentPage + 1
    const isDisabled = direction === 'prev' ? currentPage === 1 : currentPage === pageSize
    const icon = direction === 'prev' ? <FaChevronLeft /> : <FaChevronRight />

    if (isDisabled) {
        return <span className={cx('pageItem', 'disabled')}>{icon}</span>
    }

    return (
        <Link
            to={{
                pathname: path,
                search: createSearchParams({
                    ...queryParams,
                    page: targetPage.toString()
                }).toString()
            }}
            className={cx('pageItem')}
            onClick={onClick}
        >
            {icon}
        </Link>
    )
}
