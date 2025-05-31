import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { ReactSVG } from 'react-svg'
import logo from 'src/assets/icon/logo.svg'
import { Link, useMatch } from 'react-router-dom'
import { routes } from 'src/config'
import { MdMoreVert } from 'react-icons/md'
import { useMenuItems } from 'src/hooks/useMenuItem'
import { useState, useCallback } from 'react'
import useIsMobile from 'src/hooks/useIsMobile'
import HeaderNav from './HeaderNav'
import { memo } from 'react'
import DrawerMenu from './DrawMenu'

const cx = classNames.bind(styles)
const ICON_SIZE = '2rem'

function Header() {
    const isNewPage = !!useMatch('/new')
    const isMobile = useIsMobile(768)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const MENU_ITEMS = useMenuItems()

    const openDrawer = useCallback(() => {
        setDrawerOpen(true)
    }, [])

    const closeDrawer = useCallback(() => {
        setDrawerOpen(false)
    }, [])

    const renderMobileMenu = useCallback(
        () => (
            <button className={cx('nav__btn')} onClick={openDrawer} aria-label='Open menu'>
                <MdMoreVert size={ICON_SIZE} />
            </button>
        ),
        [openDrawer]
    )

    const renderDesktopMenu = useCallback(
        () => <HeaderNav isNewPage={isNewPage} menuItems={MENU_ITEMS} />,
        [isNewPage, MENU_ITEMS]
    )

    return (
        <>
            <header className={cx('header-fixed-wrapper')}>
                <div className={cx('header')}>
                    <Link to={routes.blogList} className={cx('header__logo')}>
                        <ReactSVG src={logo} />
                    </Link>
                    {isMobile ? renderMobileMenu() : renderDesktopMenu()}
                </div>
            </header>
            <DrawerMenu open={drawerOpen} onClose={closeDrawer} menuItems={MENU_ITEMS} />
        </>
    )
}

export default memo(Header)
