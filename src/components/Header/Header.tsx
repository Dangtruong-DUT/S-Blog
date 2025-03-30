import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { ReactSVG } from 'react-svg'
import logo from 'src/assets/icon/logo.svg'
import { Link, NavLink, useMatch } from 'react-router-dom'
import { routes } from 'src/config'
import { MdMoreVert } from 'react-icons/md'
import Menu from '../Popper/Components/Menu/Menu'
import SearchBar from './Component/SearchBar'
import { useMenuItems } from 'src/hooks/useMenuItem'

const cx = classNames.bind(styles)

function Header() {
    const isNewPage = useMatch('/new')

    const MENU_ITEMS = useMenuItems()
    return (
        <header className={cx('header-fixed-wrapper')}>
            <div className={cx('header')}>
                <Link to={routes.blogList} className={cx('header__logo')}>
                    <ReactSVG src={logo} />
                </Link>

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
                            <Menu items={MENU_ITEMS}>
                                <button className={cx('nav__btn')}>
                                    <MdMoreVert size={'2rem'} />
                                </button>
                            </Menu>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
