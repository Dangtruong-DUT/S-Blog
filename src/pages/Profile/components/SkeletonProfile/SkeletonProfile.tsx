import classNames from 'classnames/bind'
import styles from './SkeletonProfile.module.scss'

const cx = classNames.bind(styles)

function SkeletonProfile() {
    return (
        <div className={cx('skeleton-container')}>
            <div className={cx('skeleton-avatar')} />
            <div className={cx('skeleton-info')}>
                <div className={cx('skeleton-line', 'large')} />
                <div className={cx('skeleton-line', 'medium')} />
                <div className={cx('skeleton-buttons')}>
                    <div className={cx('skeleton-button')} />
                    <div className={cx('skeleton-button', 'small')} />
                </div>
                <div className={cx('skeleton-line', 'medium')} />
                <div className={cx('skeleton-line', 'medium')} />
            </div>
        </div>
    )
}

export default SkeletonProfile
