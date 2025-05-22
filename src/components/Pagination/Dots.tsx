import classNames from 'classnames/bind'
import styles from './Pagination.module.scss'

const cx = classNames.bind(styles)

interface Props {
    keyId: number | string
}

export default function Dots({ keyId }: Props) {
    return (
        <span key={`dots-${keyId}`} className={cx('dots')}>
            <span />
            <span />
            <span />
        </span>
    )
}
