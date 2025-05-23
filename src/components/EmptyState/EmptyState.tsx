import Lottie from 'lottie-react'
import classNames from 'classnames/bind'
import styles from './EmptyState.module.scss'
import React from 'react'

interface EmptyStateProps {
    animationData: object
    message?: string
    className?: string
}

const cx = classNames.bind(styles)

const EmptyState: React.FC<EmptyStateProps> = ({ animationData, message, className }) => (
    <div className={cx('emptyStateWrapper', className)}>
        <Lottie animationData={animationData} loop className={cx('emptyIcon')} />
        {message && <div className={cx('emptyMessage')}>{message}</div>}
    </div>
)

export default EmptyState
