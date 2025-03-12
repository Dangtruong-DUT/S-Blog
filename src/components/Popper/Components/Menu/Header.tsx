import classNames from 'classnames/bind'
import Styles from './Menu.module.scss'
import { MdChevronLeft } from 'react-icons/md' // Import icon từ react-icons/md

const cx = classNames.bind(Styles)

interface HeaderProps {
    title: string
    onBack: () => void
}

function Header({ title, onBack }: HeaderProps) {
    return (
        <header className={cx('list-items__header')}>
            <button className={cx('header__btn-back')} onClick={onBack}>
                <MdChevronLeft size='1em' />
            </button>
            <h4 className={cx('header__title')}>{title}</h4>
        </header>
    )
}

export default Header
