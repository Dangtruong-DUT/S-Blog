import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import classNames from 'classnames/bind'
import styles from './MainLayout.module.scss'

const cx = classNames.bind(styles)
interface props {
    children: React.ReactNode
}
function MainLayout({ children }: props) {
    return (
        <>
            <Header />
            <main className={cx('container')}>{children}</main>
            <Footer />
        </>
    )
}

export default MainLayout
