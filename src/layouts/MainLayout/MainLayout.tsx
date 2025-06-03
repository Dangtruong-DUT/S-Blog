import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import VirtualAssistant from 'src/components/VirtualAssistant'
import classNames from 'classnames/bind'
import styles from './MainLayout.module.scss'
import { useLocation } from 'react-router-dom'
import { routes } from 'src/config'

const cx = classNames.bind(styles)
interface props {
    children: React.ReactNode
}
function MainLayout({ children }: props) {
    const location = useLocation()

    // Hide VirtualAssistant on create/edit blog pages since we have ChatAI Assistant there
    const shouldHideVirtualAssistant =
        location.pathname === routes.createBlog ||
        (location.pathname.includes('/blogs/') && location.pathname.includes('/edit'))

    return (
        <>
            <Header />
            <main className={cx('container')}>{children}</main>
            <Footer />
            {!shouldHideVirtualAssistant && <VirtualAssistant />}
        </>
    )
}

export default MainLayout
