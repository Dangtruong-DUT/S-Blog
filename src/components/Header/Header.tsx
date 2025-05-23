import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { ReactSVG } from 'react-svg'
import logo from 'src/assets/icon/logo.svg'
import { Link, useMatch } from 'react-router-dom'
import { routes } from 'src/config'
import { MdMoreVert } from 'react-icons/md'
import { useMenuItems } from 'src/hooks/useMenuItem'
import { useState } from 'react'
import useIsMobile from 'src/hooks/useIsMobile'
import DrawerMenuNew from './DrawerMenuNew'
import HeaderNav from './HeaderNav'

const cx = classNames.bind(styles)

function Header() {
    const isNewPage = useMatch('/new')
    const isMobile = useIsMobile(768)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const MENU_ITEMS = useMenuItems()
    return (
        <header className={cx('header-fixed-wrapper')}>
            <div className={cx('header')}>
                <Link to={routes.blogList} className={cx('header__logo')}>
                    <ReactSVG src={logo} />
                </Link>
                {isMobile ? (
                    <>
                        <button className={cx('nav__btn')} onClick={() => setDrawerOpen(true)} aria-label='Open menu'>
                            <MdMoreVert size={'2rem'} />
                        </button>
                        <DrawerMenuNew open={drawerOpen} onClose={() => setDrawerOpen(false)} menuItems={MENU_ITEMS} />
                    </>
                ) : (
                    <HeaderNav isNewPage={!!isNewPage} menuItems={MENU_ITEMS} />
                )}
            </div>
        </header>
    )
}

export default Header
