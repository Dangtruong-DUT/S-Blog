import classNames from 'classnames/bind'
import SettingSideNav from 'src/components/SettingSideNav'
import styles from './SettingLayout.module.scss'
import Header from 'src/components/Header'

const cx = classNames.bind(styles)

interface Props {
    children: React.ReactNode
}

function SettingLayout({ children }: Props) {
    return (
        <>
            <Header />
            <div className={cx('SettingLayoutWrapper')}>
                <div className={cx('settingSidebar')}>
                    <SettingSideNav />
                </div>
                <main className={cx('settingContent')}>{children}</main>
            </div>
        </>
    )
}

export default SettingLayout
