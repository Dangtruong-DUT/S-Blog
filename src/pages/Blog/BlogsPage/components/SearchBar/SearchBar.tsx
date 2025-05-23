import classNames from 'classnames/bind'
import styles from './SearchBar.module.scss'
import { CiSearch } from 'react-icons/ci'
import { useState, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useQuery } from '@tanstack/react-query'
import useDebounce from 'src/hooks/useDebounce'
import searchApi from 'src/apis/Search.api'
import PopperWrapper from 'src/components/Popper'
import AccountItem from 'src/components/AccountItem'
import { generateNameId } from 'src/utils/common.util'
import { User } from 'src/types/user.type'
import { Blog } from 'src/types/blog.type'

const cx = classNames.bind(styles)
function SearchBar() {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceValue = useDebounce({ value: searchValue, delay: 500 })

    const { data, isLoading } = useQuery({
        queryKey: ['search', debounceValue],
        queryFn: () => searchApi.searchAll({ q: debounceValue, type: 'less' }),
        enabled: !!debounceValue
    })
    const searchResults = data?.data.data as { users: User[]; posts: Blog[] }

    const handleOpen = () => {
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
    }
    const handleClose = () => {
        setOpen(false)
        setSearchValue('')
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }
    const handleClear = () => {
        setSearchValue('')
        inputRef.current?.focus()
    }
    const renderSearchResults = () => {
        if (!searchResults) return null
        return (
            <PopperWrapper>
                <div className={cx('search-results-wrapper')}>
                    <h4 className={cx('search-title')}>Search results</h4>
                    {searchResults.users?.length > 0 && (
                        <section>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            <ul>
                                {searchResults.users.map((user: User) => (
                                    <li key={user.id}>
                                        <AccountItem
                                            avatarSize='40px'
                                            avatar={user.avatar}
                                            title={user.email}
                                            nameAccount={`${user.first_name} ${user.last_name}`}
                                            verified={false}
                                            to={`/@${user.id}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {searchResults.posts?.length > 0 && (
                        <section>
                            <h4 className={cx('search-title')}>Posts</h4>
                            <ul>
                                {searchResults.posts.map((post: Blog) => (
                                    <li key={post.id}>
                                        <AccountItem
                                            avatarSize='40px'
                                            avatar={post.featured_image}
                                            title={post.title}
                                            nameAccount={post.title}
                                            verified={false}
                                            to={`/blogs/${generateNameId({ name: post.title, id: post.id })}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </PopperWrapper>
        )
    }
    return (
        <div className={cx('searchBarWrapper')}>
            <button className={cx('searchBar', 'searchBar--button')} onClick={handleOpen} type='button' tabIndex={0}>
                <CiSearch size={'2rem'} />
                <span className={cx('searchBar__placeholder')}>Type something…</span>
            </button>
            {open && (
                <div className={cx('modalOverlay-modern')} onClick={handleClose}>
                    <div className={cx('modalContent-modern')} onClick={(e) => e.stopPropagation()}>
                        <button className={cx('closeBtn-modern')} onClick={handleClose}>
                            <AiOutlineClose size={24} />
                        </button>
                        <div className={cx('modal-search-header')}>
                            <CiSearch size={'1.5rem'} className={cx('modal-search-icon')} />
                            <input
                                ref={inputRef}
                                type='text'
                                name='search'
                                placeholder='Tìm kiếm blog, tài khoản...'
                                className={cx('modal-search-input')}
                                value={searchValue}
                                onChange={handleInputChange}
                                autoFocus
                            />
                            {searchValue && (
                                <button type='button' className={cx('clearBtn-modern')} onClick={handleClear}>
                                    X
                                </button>
                            )}
                        </div>
                        <div className={cx('results-container-modern')}>
                            {isLoading ? (
                                <div className={cx('search-loading')}>Đang tìm kiếm...</div>
                            ) : (
                                renderSearchResults()
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar
