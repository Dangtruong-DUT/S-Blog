import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { ReactSVG } from 'react-svg'
import logo from 'src/assets/icon/logo.svg'
import { Link } from 'react-router-dom'
import { routes } from 'src/config'
import SearchBar from '../SearchBar'
import { MdWbSunny, MdNightlightRound } from 'react-icons/md'
import { useContext } from 'react'
import { SettingsContext } from 'src/contexts/settings.context'

const cx = classNames.bind(styles)

function Header() {
    const { state, dispatch } = useContext(SettingsContext)

    const toggleTheme = () => {
        dispatch({ type: 'TOGGLE_THEME' })
    }
    return (
        <header className={cx('header-fixed-wrapper')}>
            <div className={cx('header')}>
                <Link to={routes.home} className={cx('header__logo')}>
                    <ReactSVG src={logo} />
                </Link>
                <div style={{ display: 'flex', columnGap: '20px' }}>
                    <SearchBar />
                    <button onClick={toggleTheme} className={cx('theme-toggle')}>
                        {state.theme == 'dark' ? (
                            <MdWbSunny color='yellow' size={24} />
                        ) : (
                            <MdNightlightRound color='purple' size={24} />
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
