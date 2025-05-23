import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'
import { routes } from 'src/config'
import Menu from '../Popper/Components/Menu/Menu'
import { MdMoreVert } from 'react-icons/md'
import SearchBar from '../SearchBar'
import { MenuItem } from 'src/types/Menu.type'

const cx = classNames.bind(styles)

interface HeaderNavProps {
    isNewPage: boolean
    menuItems: MenuItem[]
}

const HeaderNav = ({ isNewPage, menuItems }: HeaderNavProps) => (
    <nav style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <ul className={cx('nav_list')}>
            {!isNewPage && (
                <li>
                    <SearchBar />
                </li>
            )}
            <li>
                <NavLink
                    to={routes.blogList}
                    className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                >
                    New
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={routes.category}
                    className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                >
                    Category
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={routes.createBlog}
                    className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                >
                    Create
                </NavLink>
            </li>
            <li>
                <Menu items={menuItems}>
                    <button className={cx('nav__btn')}>
                        <MdMoreVert size={'2rem'} />
                    </button>
                </Menu>
            </li>
        </ul>
    </nav>
)

export default HeaderNav
