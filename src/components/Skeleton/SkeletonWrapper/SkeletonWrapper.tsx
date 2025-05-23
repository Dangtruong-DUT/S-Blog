import classNames from 'classnames/bind'
import styles from '../Skeleton.module.scss'

const cx = classNames.bind(styles)

interface SkeletonWrapperProps {
    children: React.ReactNode
    className?: string
}

function SkeletonWrapper({ children, className }: SkeletonWrapperProps) {
    return (
        <div role='status' className={cx('skeletonContainer', className)}>
            {children}
        </div>
    )
}

export default SkeletonWrapper
