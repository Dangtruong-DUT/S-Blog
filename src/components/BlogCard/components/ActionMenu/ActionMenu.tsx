import { memo } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { Link } from 'react-router-dom'
import styles from './ActionMenu.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface Props {
    blogId: string
    onDelete: (e: React.MouseEvent) => void
}

const ActionMenu = ({ blogId, onDelete }: Props) => {
    return (
        <div className={cx('menu')}>
            <Link to={`/blogs/${blogId}/edit`} className={cx('button')}>
                <FiEdit size='2.1rem' />
                <span>Edit</span>
            </Link>
            <button className={cx('button', 'delete')} onClick={onDelete}>
                <MdDeleteOutline size='2.1rem' />
                <span>Delete</span>
            </button>
        </div>
    )
}

export default memo(ActionMenu)
