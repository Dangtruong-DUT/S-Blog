import classNames from 'classnames/bind'
import styles from './NotFound1.module.scss'
import { ReactSVG } from 'react-svg'
import Ellipse102 from 'src/assets/icon/Ellipse 102.svg'
import Ellipse103 from 'src/assets/icon/Ellipse 103.svg'
import Ellipse104 from 'src/assets/icon/Ellipse 104.svg'
import Group36661 from 'src/assets/icon/Group 36661.svg'
import Group36662 from 'src/assets/icon/Group 36662.svg'
import Group36663 from 'src/assets/icon/Group 36663.svg'
import Group36664 from 'src/assets/icon/Group 36664.svg'

const cx = classNames.bind(styles)

function NotFound() {
    return (
        <div className={cx('container')}>
            <div className={cx('content-wrapper')}>
                <section className={cx('content-center')}>
                    <h1 className={cx('title')}>404</h1>
                    <h2 className={cx('subtitle')}>Page not found</h2>
                    <p className={cx('description')}>
                        we’re sorry. the page you requested could not be found. Please go back to the home page.
                    </p>
                </section>

                <ReactSVG src={Ellipse102} className={cx('icon', 'ellipse102')} />
                <ReactSVG src={Ellipse103} className={cx('icon', 'ellipse103')} />
                <ReactSVG src={Ellipse104} className={cx('icon', 'ellipse104')} />
                <ReactSVG src={Group36661} className={cx('icon', 'group36661')} />
                <ReactSVG src={Group36662} className={cx('icon', 'group36662')} />
                <ReactSVG src={Group36663} className={cx('icon', 'group36663')} />
                <ReactSVG src={Group36664} className={cx('icon', 'group36664')} />
            </div>
        </div>
    )
}

export default NotFound
