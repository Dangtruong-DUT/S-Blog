import Tippy from '@tippyjs/react/headless'
import classNames from 'classnames/bind'
import Styles from './Menu.module.scss'
import MenuItem from './MenuItem'
import Header from './Header'
import { useState, ReactElement } from 'react'
import PopperWrapper from '../..'
import { MenuItem as MenuItemType } from 'src/types/Menu.type'

const cx = classNames.bind(Styles)

interface MenuItemWithMenuItems {
    title: string
    menuItems?: MenuItemType[]
}

interface MenuProps {
    hideOnClick?: boolean
    children: ReactElement
    items: MenuItemType[]
    onChange?: (title: string) => void
}

function Menu({ hideOnClick = false, children, items = [], onChange }: MenuProps) {
    const [history, setHistory] = useState<MenuItemWithMenuItems[]>([{ title: '', menuItems: items }])
    const current = history[history.length - 1]

    const renderItems = () => {
        return (
            current.menuItems?.map((item, index) => {
                const hasSubMenu = !!item.children
                const isActive = item.active
                return (
                    <MenuItem
                        key={index}
                        className={cx('item')}
                        active={isActive}
                        data={item}
                        onClick={() => {
                            if (hasSubMenu) {
                                setHistory((prev) => [
                                    ...prev,
                                    { title: item.title, menuItems: item.children?.menuItems }
                                ])
                            } else {
                                // Cập nhật trạng thái active cho menu item
                                setHistory((prev) => {
                                    const updatedMenuItems =
                                        prev[prev.length - 1].menuItems?.map((menuItem) => ({
                                            ...menuItem,
                                            active: menuItem.title === item.title
                                        })) || []

                                    return [
                                        ...prev.slice(0, prev.length - 1),
                                        { ...prev[prev.length - 1], menuItems: updatedMenuItems }
                                    ]
                                })

                                if (item.onClick) item.onClick()
                                if (onChange) onChange(item.title)
                            }
                        }}
                    />
                )
            }) || []
        )
    }

    return (
        <Tippy
            delay={[300, 500]}
            interactive
            offset={[12, 10]}
            placement='bottom-end'
            hideOnClick={hideOnClick}
            render={(attrs) => {
                return (
                    <div className={cx('list-items')} tabIndex={-1} {...attrs}>
                        <PopperWrapper className={cx('menu-wrapper')}>
                            {history.length > 1 && current?.menuItems && (
                                <Header
                                    title={current.title}
                                    onBack={() => {
                                        setHistory((prev) => prev.slice(0, prev.length - 1))
                                    }}
                                />
                            )}
                            <div className={cx('menu-body')}>{renderItems()}</div>
                        </PopperWrapper>
                    </div>
                )
            }}
            onHide={() => {
                setHistory((prev) => prev.slice(0, 1))
            }}
        >
            {children}
        </Tippy>
    )
}

export default Menu
