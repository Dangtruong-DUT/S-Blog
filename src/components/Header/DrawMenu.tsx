import { useState, useEffect, FC, memo, MouseEvent } from 'react'
import classNames from 'classnames/bind'
import { NavLink, Link } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md'

import styles from './Header.module.scss'
import drawerStyles from './DrawerMenu.module.scss'
import { routes } from 'src/config'
import SearchBar from '../SearchBar'
import { MenuItem as MenuItemType } from 'src/types/Menu.type'

const cx = classNames.bind(styles)
const dx = classNames.bind(drawerStyles)

interface DrawerMenuProps {
    open: boolean
    onClose: () => void
    menuItems: MenuItemType[]
}

interface MenuStack {
    title: string
    menuItems: MenuItemType[]
}

// ======== Sub-Components ========

const ArrowIcon: FC = memo(() => <MdKeyboardArrowRight size='2rem' className={dx('arrow-icon')} />)

const getNavLinkClass = (isActive: boolean) => cx('nav__link', { 'nav__link--active': isActive })

const NavigationLinks: FC<{ onClose: () => void }> = memo(({ onClose }) => {
    const links = [
        { to: routes.blogList, label: 'New' },
        { to: routes.category, label: 'Category' },
        { to: routes.createBlog, label: 'Create' }
    ]

    return (
        <ul className={cx('nav_list', 'drawer__list')}>
            {links.map(({ to, label }) => (
                <li key={to}>
                    <NavLink to={to} onClick={onClose} className={({ isActive }) => getNavLinkClass(isActive)}>
                        {label}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
})

const MenuHeader: FC<{ title: string; hasParent: boolean; onBack: () => void }> = memo(
    ({ title, hasParent, onBack }) => {
        if (!hasParent) return null
        return (
            <div className={dx('drawer-menu-header')}>
                <button className={dx('back-button')} onClick={onBack} aria-label='Back to previous menu'>
                    <MdKeyboardArrowLeft size='2rem' />
                </button>
                <h3 className={dx('menu-title')}>{title}</h3>
            </div>
        )
    }
)

const MenuItem: FC<{ item: MenuItemType; onClick: (item: MenuItemType) => void }> = memo(({ item, onClick }) => {
    const handleClick = () => onClick(item)

    const itemClass = cx('nav__link', dx('menu-item-base'), {
        'nav__link--active': item.active
    })

    if (item.to) {
        return (
            <Link to={item.to} className={itemClass} onClick={handleClick}>
                {item.title}
                {item.children && <ArrowIcon />}
            </Link>
        )
    }

    return (
        <button
            className={cx('nav__link', dx('menu-item-button'), {
                'nav__link--active': item.active
            })}
            onClick={handleClick}
        >
            {item.title}
            {item.children && <ArrowIcon />}
        </button>
    )
})

// ======== Main Component ========

const DrawerMenu: FC<DrawerMenuProps> = ({ open, onClose, menuItems }) => {
    const initialMenuStack: MenuStack[] = [{ title: '', menuItems }]
    const [menuStack, setMenuStack] = useState<MenuStack[]>(initialMenuStack)
    const currentMenu = menuStack[menuStack.length - 1]
    const hasParent = menuStack.length > 1

    useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => {
                setMenuStack(initialMenuStack)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [open, menuItems])

    const handleBackClick = () => {
        if (hasParent) {
            setMenuStack((prev) => prev.slice(0, -1))
        }
    }

    const handleItemClick = (item: MenuItemType) => {
        if (item.children) {
            setMenuStack((prev) => [...prev, { title: item.title, menuItems: item.children!.menuItems }])
        } else {
            item.onClick?.()
            onClose()
        }
    }

    const stopPropagation = (e: MouseEvent) => e.stopPropagation()

    if (!open) return null

    return (
        <div className={cx('drawer-overlay')} onClick={onClose}>
            <nav className={cx('drawer')} onClick={stopPropagation}>
                <button className={cx('drawer__close')} onClick={onClose} aria-label='Close menu'>
                    <AiOutlineClose size='2rem' />
                </button>

                <div className={cx('drawer__search')}>
                    <SearchBar alwaysExpand mobile />
                </div>

                <NavigationLinks onClose={onClose} />

                <div className={cx('drawer__menu')}>
                    <MenuHeader title={currentMenu.title} hasParent={hasParent} onBack={handleBackClick} />
                    <ul className={cx('drawer__list')}>
                        {currentMenu.menuItems.map((item, index) => (
                            <li key={`${item.title}-${index}`}>
                                <MenuItem item={item} onClick={handleItemClick} />
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default DrawerMenu
