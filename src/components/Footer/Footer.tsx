import classNames from 'classnames/bind'
import styles from './Footer.module.scss'
import logo from 'src/assets/icon/logo.svg'
import { ReactSVG } from 'react-svg'
import SOCIALS from 'src/constants/Socials'

const cx = classNames.bind(styles)

function Footer() {
    return (
        <footer className={cx('footerWrapper')}>
            <div className={cx('footerInner')}>
                <ReactSVG src={logo} />
                <ul className={cx('footer-socials')}>
                    {SOCIALS.map((social) => (
                        <li key={social.label}>
                            <a href={social.href} aria-label={social.label} className={cx('footer-socials__link')}>
                                {social.icon}
                            </a>
                        </li>
                    ))}
                </ul>
                <p className={cx('footer_copyright')}>© 2025 TapLamIT.</p>
            </div>
        </footer>
    )
}

export default Footer
