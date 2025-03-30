import classNames from 'classnames/bind'
import Styles from './Menu.module.scss'
import { ReactNode } from 'react'
import Button from 'src/components/Button'
import { MenuItem as MenuItemType } from 'src/types/Menu.type'

const cx = classNames.bind(Styles)

export interface MenuItemProps {
    data: MenuItemType
    onClick?: () => void
    leftIcon?: ReactNode
    className?: string
    active?: boolean
}

function MenuItem({ data, onClick, className, active }: MenuItemProps) {
    const classes = cx(
        'list-items__item',
        {
            separate: data.separate
        },
        className,
        { active: active }
    )
    const classNameInner = cx('itemInner')

    return (
        <Button classNameInner={classNameInner} className={classes} to={data.to} onClick={onClick}>
            {data.icon && <span className={cx('icon')}>{data.icon}</span>}
            <span className={cx('title')}>{data.title}</span>
        </Button>
    )
}

export default MenuItem
