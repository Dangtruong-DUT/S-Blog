import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import drawerStyles from './DrawerMenu.module.scss'
import { NavLink, Link } from 'react-router-dom'
import { routes } from 'src/config'
import { AiOutlineClose } from 'react-icons/ai'
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md'
import SearchBar from '../SearchBar'
import { MenuItem } from 'src/types/Menu.type'

const cx = classNames.bind(styles)
const dx = classNames.bind(drawerStyles)

interface DrawerMenuProps {
    open: boolean
    onClose: () => void
    menuItems: MenuItem[]
}

interface MenuStack {
    title: string
    menuItems: MenuItem[]
}

const DrawerMenuNew = ({ open, onClose, menuItems }: DrawerMenuProps) => {
    const [menuStack, setMenuStack] = useState<MenuStack[]>([{ title: '', menuItems }])
    const currentMenu = menuStack[menuStack.length - 1]

    // Reset menu stack when drawer closes
    useEffect(() => {
        if (!open) {
            // Reset after animation finishes
            const timer = setTimeout(() => {
                setMenuStack([{ title: '', menuItems }])
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [open, menuItems])

    const handleBackClick = () => {
        if (menuStack.length > 1) {
            setMenuStack((prev) => prev.slice(0, prev.length - 1))
        }
    }

    const handleItemClick = (item: MenuItem) => {
        if (item.children) {
            setMenuStack([...menuStack, { title: item.title, menuItems: item.children.menuItems }])
        } else if (item.onClick) {
            item.onClick()
            onClose()
        } else if (item.to) {
            onClose()
        }
    }

    if (!open) return null

    return (
        <div className={cx('drawer-overlay')} onClick={onClose}>
            <nav className={cx('drawer')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('drawer__close')} onClick={onClose} aria-label='Close menu'>
                    <AiOutlineClose size={'2rem'} />
                </button>
                <div className={cx('drawer__search')}>
                    <SearchBar alwaysExpand mobile />
                </div>{' '}
                <ul className={cx('nav_list', 'drawer__list')}>
                    <li>
                        <NavLink
                            to={routes.blogList}
                            onClick={onClose}
                            className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                        >
                            New
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={routes.category}
                            onClick={onClose}
                            className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                        >
                            Category
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={routes.createBlog}
                            onClick={onClose}
                            className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                        >
                            Create
                        </NavLink>
                    </li>
                </ul>
                <div className={cx('drawer__menu')}>
                    {menuStack.length > 1 && (
                        <div className={dx('drawer-menu-header')}>
                            <button
                                className={dx('back-button')}
                                onClick={handleBackClick}
                                aria-label='Back to previous menu'
                            >
                                <MdKeyboardArrowLeft size='2rem' />
                            </button>
                            <h3 className={dx('menu-title')}>{currentMenu.title}</h3>
                        </div>
                    )}
                    <ul className={cx('drawer__list')}>
                        {currentMenu.menuItems.map((item, index) => (
                            <li key={index}>
                                {item.to ? (
                                    <Link
                                        to={item.to}
                                        className={cx('nav__link', { 'nav__link--active': item.active })}
                                        onClick={() => handleItemClick(item)}
                                        style={{
                                            paddingLeft: '16px',
                                            textAlign: 'left',
                                            width: '100%'
                                        }}
                                    >
                                        {item.title}
                                        {item.children && (
                                            <MdKeyboardArrowRight
                                                size='2rem'
                                                style={{ marginLeft: '8px', float: 'right' }}
                                            />
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        className={cx('nav__link', { 'nav__link--active': item.active })}
                                        onClick={() => handleItemClick(item)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            width: '100%',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            paddingLeft: '16px'
                                        }}
                                    >
                                        {item.title}
                                        {item.children && (
                                            <MdKeyboardArrowRight
                                                size='2rem'
                                                style={{ marginLeft: '8px', float: 'right' }}
                                            />
                                        )}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default DrawerMenuNew
