import React, { useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './UserAccessLayout.module.scss'

const cx = classNames.bind(styles)

interface UserAccessLayoutProps {
    left: React.ReactNode
    right: React.ReactNode
}

const UserAccessLayout: React.FC<UserAccessLayoutProps> = React.memo(({ left, right }) => {
    const leftSection = useMemo(() => <div className={cx('left-section')}>{left}</div>, [left])
    const rightSection = useMemo(() => <div className={cx('right-section')}>{right}</div>, [right])
    return (
        <div className={cx('container')}>
            {leftSection}
            {rightSection}
        </div>
    )
})

export default UserAccessLayout
