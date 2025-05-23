import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'
import { routes } from 'src/config'
import Menu from '../Popper/Components/Menu/Menu'
import { AiOutlineClose } from 'react-icons/ai'
import SearchBar from '../SearchBar'
import { MenuItem } from 'src/types/Menu.type'

const cx = classNames.bind(styles)

interface DrawerMenuProps {
    open: boolean
    onClose: () => void
    menuItems: MenuItem[]
}

const DrawerMenu = ({ open, onClose, menuItems }: DrawerMenuProps) => {
    if (!open) return null
    return (
        <div className={cx('drawer-overlay')} onClick={onClose}>
            <nav className={cx('drawer')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('drawer__close')} onClick={onClose} aria-label='Close menu'>
                    <AiOutlineClose size={'2rem'} />
                </button>
                <div className={cx('drawer__search')}>
                    <SearchBar alwaysExpand mobile />
                </div>
                <ul className={cx('drawer__list')}>
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
                    <Menu items={menuItems} hideOnClick={true}>
                        <span />
                    </Menu>
                </div>
            </nav>
        </div>
    )
}

export default DrawerMenu
