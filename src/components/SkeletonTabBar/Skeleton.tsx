import classNames from 'classnames/bind'
import styles from './Skeleton.module.scss'

const cx = classNames.bind(styles)

function SkeletonTabBar() {
    return (
        <div className={cx('skeleton-tabs')}>
            <div className={cx('skeleton-tab')} />
            <div className={cx('skeleton-tab')} />
            <div className={cx('skeleton-tab')} />
            <div className={cx('skeleton-tab')} />
        </div>
    )
}

export default SkeletonTabBar
