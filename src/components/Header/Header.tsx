import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { ReactSVG } from 'react-svg'
import logo from 'src/assets/icon/logo.svg'
import { NavLink } from 'react-router-dom'
import { routes } from 'src/config'
import { MdMoreVert } from 'react-icons/md'
import { CiSearch } from 'react-icons/ci'
import { MENU_ITEMS } from 'src/constants/MenuItem'
import Menu from '../Popper/Components/Menu/Menu'

const cx = classNames.bind(styles)

function Header() {
    const handleMenuChange = (title: string) => {
        console.log(title)
    }
    return (
        <header className={cx('header-fixed-wrapper')}>
            <div className={cx('header')}>
                <ReactSVG src={logo} />
                <nav>
                    <ul className={cx('nav_list')}>
                        <li>
                            <button className={cx('nav__btn', 'nav__btn--search')}>
                                <CiSearch size={'2rem'} />
                            </button>
                        </li>
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
                                to={routes.readingList}
                                className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                            >
                                Reading list
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={routes.topicsList}
                                className={({ isActive }) => cx('nav__link', { 'nav__link--active': isActive })}
                            >
                                Topics
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
                            <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
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
