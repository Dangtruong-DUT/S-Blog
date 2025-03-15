import classNames from 'classnames/bind'
import styles from './SearchBar.module.scss'
import { CiSearch } from 'react-icons/ci'

const cx = classNames.bind(styles)
function SearchBar() {
    return (
        <div className={cx('searchBarWrapper')}>
            <form className={cx('searchBar')}>
                <input type='text' name='search' placeholder='Type something…' className={cx('searchBar__input')} />
                <button type='submit' className={cx('searBar__btn')}>
                    <CiSearch size={'2rem'} />
                </button>
            </form>
        </div>
    )
}

export default SearchBar
