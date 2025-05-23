import classNames from 'classnames/bind'
import { NavLink } from 'react-router-dom'
import styles from './SettingSideNav.module.scss'
import { routes } from 'src/config'
import { FaLock } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa'

const cx = classNames.bind(styles)

export default function SettingSideNav() {
    return (
        <aside className={cx('user-sidenav')}>
            <nav className={cx('user-sidenav__menu')}>
                <NavLink
                    to={routes.settingProfile}
                    end
                    className={({ isActive }) =>
                        cx('user-sidenav__menu-item', { 'user-sidenav__menu-item--active': isActive })
                    }
                >
                    <FaUser size={'2rem'} />
                    <span>Manage account</span>
                </NavLink>

                <NavLink
                    to={routes.changePassword}
                    className={({ isActive }) =>
                        cx('user-sidenav__menu-item', { 'user-sidenav__menu-item--active': isActive })
                    }
                >
                    <FaLock size={'2rem'} />
                    <span> Privacy</span>
                </NavLink>
            </nav>
        </aside>
    )
}
