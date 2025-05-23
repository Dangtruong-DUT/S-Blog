import classNames from 'classnames/bind'
import styles from '../Skeleton.module.scss'

const cx = classNames.bind(styles)

interface SkeletonLineProps {
    className?: string
    width?: number
    height?: number
    radius?: number
}

function SkeletonLine({ className, height, width, radius }: SkeletonLineProps) {
    return <div className={cx('skeletonLine', className)} style={{ height, width, borderRadius: radius }} />
}

export default SkeletonLine
