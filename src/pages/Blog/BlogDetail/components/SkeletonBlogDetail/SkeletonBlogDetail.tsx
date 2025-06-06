import classNames from 'classnames/bind'
import styles from './SkeletonBlogDetail.module.scss'
import { SkeletonBlogCard } from 'src/components/Skeleton'

const cx = classNames.bind(styles)

function SkeletonBlogDetail() {
    return (
        <div className={cx('skeleton-container')}>
            <div className={cx('skeleton-line', 'skeleton-line--large')}></div>
            <div className={cx('skeleton-line', 'skeleton-line--medium')}></div>
            <div className={cx('skeleton-line', 'skeleton-line--medium')}></div>
            <div className={cx('skeleton-footer')}>
                <SkeletonBlogCard />
            </div>
        </div>
    )
}

export default SkeletonBlogDetail
