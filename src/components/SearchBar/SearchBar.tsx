/* eslint-disable @typescript-eslint/no-explicit-any */
import Tippy from '@tippyjs/react'
import { CiSearch } from 'react-icons/ci'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import classNames from 'classnames/bind'
import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './SearchBar.module.scss'
import PopperWrapper from 'src/components/Popper'
import useDebounce from 'src/hooks/useDebounce'
import searchApi from 'src/apis/Search.api'
import AccountItem from '../AccountItem'
import { User } from 'src/types/user.type'
import { Blog } from 'src/types/blog.type'

const cx = classNames.bind(styles)

interface SearchResult {
    users?: User[]
    posts?: Blog[]
}

function SearchBar() {
    const [searchValue, setSearchValue] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const debounceValue = useDebounce({ value: searchValue, delay: 500 })

    const { data, isLoading } = useQuery({
        queryKey: ['search', debounceValue],
        queryFn: () => searchApi.searchAll({ q: debounceValue, type: 'less' }),
        enabled: !!debounceValue
    })

    const searchResults = data?.data.data as SearchResult

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.startsWith(' ')) return
        setSearchValue(value)
        setIsExpanded(true)
    }

    const handleClearSearch = () => {
        setSearchValue('')
        setIsExpanded(false)
        inputRef.current?.focus()
    }

    const handleBlur = () => {
        if (!searchValue) setIsExpanded(false)
    }

    const handleExpandSearch = () => {
        setIsExpanded(true)
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const renderSearchResults = () => {
        if (!searchResults) return null

        return (
            <PopperWrapper>
                <div className={cx('search-results-wrapper')}>
                    <h4 className={cx('search-title')}>Search results</h4>
                    {searchResults.users?.length && searchResults.users?.length > 0 && (
                        <section>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            <ul>
                                {searchResults.users?.map((user) => (
                                    <li key={user.id}>
                                        <AccountItem
                                            avatarSize='40px'
                                            avatar={user.avatar}
                                            username={user.username}
                                            nameAccount={`${user.first_name} ${user.last_name}`}
                                            verified={false}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {searchResults.posts?.length && searchResults.posts?.length > 0 && (
                        <section>
                            <h4 className={cx('search-title')}>Posts</h4>
                            <ul>
                                {searchResults.posts.map((post) => (
                                    <li key={post.id}>
                                        <AccountItem
                                            avatarSize='40px'
                                            avatar={post.feature_image}
                                            username={post.title}
                                            nameAccount={post.title}
                                            verified={false}
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

    console.log(isExpanded)

    const ResultVisible = Boolean(
        isExpanded &&
            ((searchResults?.users?.length && searchResults?.users?.length > 0) ||
                (searchResults?.posts?.length && searchResults?.posts?.length > 0))
    )

    return (
        <Tippy
            visible={ResultVisible}
            interactive
            placement='bottom'
            onClickOutside={() => setIsExpanded(false)}
            offset={[0, 8]}
            render={(attrs) => (
                <div className={cx('search-proper')} tabIndex={-1} {...attrs}>
                    {renderSearchResults()}
                </div>
            )}
        >
            <div className={cx('search-bar', { 'search-bar--expanded': isExpanded })}>
                <button className={cx('search-bar__icon-btn')} onClick={handleExpandSearch} aria-label='Expand search'>
                    <CiSearch size='2rem' />
                </button>
                <div className={cx('search-bar__group', { 'search-bar__group--active': isExpanded })}>
                    <input
                        ref={inputRef}
                        type='text'
                        id='search'
                        className={cx('search-bar__input')}
                        value={searchValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder='Search...'
                    />
                    {searchValue && (
                        <button
                            className={cx('search-bar__clear-btn')}
                            onClick={handleClearSearch}
                            aria-label='Clear search'
                        >
                            {isLoading ? (
                                <AiOutlineLoading3Quarters size='0.7rem' className={cx('search-bar__loading-icon')} />
                            ) : (
                                <AiOutlineClose size='1.3rem' />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Tippy>
    )
}

export default SearchBar
