import Tippy from '@tippyjs/react'
import { CiSearch } from 'react-icons/ci'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import classNames from 'classnames/bind'
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './SearchBar.module.scss'
import PopperWrapper from 'src/components/Popper'
import useDebounce from 'src/hooks/useDebounce'
import searchApi from 'src/apis/Search.api'
import AccountResults from './AccountResults'
import PostResults from './PostResults'
import { User } from 'src/types/user.type'
import { Blog } from 'src/types/blog.type'

const cx = classNames.bind(styles)

interface SearchResult {
    users?: User[]
    posts?: Blog[]
}

function SearchBar(props: { alwaysExpand?: boolean; mobile?: boolean }) {
    const [searchValue, setSearchValue] = useState('')
    const [isExpanded, setIsExpanded] = useState(props.alwaysExpand || false)
    const inputRef = useRef<HTMLInputElement>(null)

    const debounceValue = useDebounce({ value: searchValue, delay: 500 })

    // useCallback để tối ưu các handler
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.startsWith(' ')) return
        setSearchValue(value)
        setIsExpanded(true)
    }, [])

    const handleClearSearch = useCallback(() => {
        setSearchValue('')
        setIsExpanded(false)
        inputRef.current?.focus()
    }, [])

    const handleBlur = useCallback(() => {
        if (!searchValue) setIsExpanded(false)
    }, [searchValue])

    const handleExpandSearch = useCallback(() => {
        setIsExpanded(true)
        setTimeout(() => inputRef.current?.focus(), 100)
    }, [])

    const { data, isLoading } = useQuery({
        queryKey: ['search', debounceValue],
        queryFn: () => searchApi.searchAll({ q: debounceValue, type: 'less' }),
        enabled: !!debounceValue
    })

    const searchResults = useMemo(() => data?.data.data as SearchResult, [data])

    const renderSearchResults = useCallback(() => {
        if (!searchResults) return null
        const hasUsers = Array.isArray(searchResults.users) && searchResults.users.length > 0
        const hasPosts = Array.isArray(searchResults.posts) && searchResults.posts.length > 0
        const hasNoResults = !hasUsers && !hasPosts
        return (
            <PopperWrapper>
                <div className={cx('search-results-wrapper')}>
                    <h4 className={cx('search-title')}>Search results</h4>
                    {hasUsers && <AccountResults users={searchResults.users!} />}
                    {hasPosts && <PostResults posts={searchResults.posts!} />}
                    {hasNoResults && <div className={cx('no-result')}>No results found.</div>}
                </div>
            </PopperWrapper>
        )
    }, [searchResults])

    const ResultVisible = Boolean(
        isExpanded &&
            ((searchResults?.users?.length && searchResults?.users?.length > 0) ||
                (searchResults?.posts?.length && searchResults?.posts?.length > 0))
    )
    useEffect(() => {
        if (props.alwaysExpand) setIsExpanded(true)
    }, [props.alwaysExpand])

    // Nếu là alwaysExpand (mobile/drawer) thì render kết quả search ngay bên dưới input, không dùng Tippy
    if (props.alwaysExpand) {
        return (
            <div className={cx('search-bar-mobile-wrapper')}>
                <div
                    className={cx('search-bar', {
                        'search-bar--expanded': true,
                        'search-bar--mobile': props.mobile
                    })}
                    style={props.mobile ? { width: '100%' } : {}}
                >
                    <div
                        className={cx('search-bar__group', {
                            'search-bar__group--active': true
                        })}
                        style={props.mobile ? { width: '100%' } : {}}
                    >
                        <input
                            ref={inputRef}
                            type='text'
                            id='search'
                            className={cx('search-bar__input')}
                            value={searchValue}
                            onChange={handleInputChange}
                            placeholder='Search...'
                            style={props.mobile ? { fontSize: '1.2rem', padding: '8px 0' } : {}}
                        />
                        {searchValue && (
                            <button
                                className={cx('search-bar__clear-btn')}
                                onClick={handleClearSearch}
                                aria-label='Clear search'
                            >
                                {isLoading ? (
                                    <AiOutlineLoading3Quarters
                                        size='0.7rem'
                                        className={cx('search-bar__loading-icon')}
                                    />
                                ) : (
                                    <AiOutlineClose size='1.3rem' />
                                )}
                            </button>
                        )}
                    </div>
                </div>
                {/* Kết quả search hiển thị bên ngoài search bar, overlay trên giao diện */}
                {searchValue && <div className={cx('search-mobile-results-overlay')}>{renderSearchResults()}</div>}
            </div>
        )
    }

    return (
        <Tippy
            visible={ResultVisible && !props.alwaysExpand}
            hideOnClick={false}
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
            <div
                className={cx('search-bar', {
                    'search-bar--expanded': isExpanded,
                    'search-bar--mobile': props.mobile
                })}
                style={props.mobile ? { width: '100%' } : {}}
            >
                {!props.alwaysExpand && (
                    <button
                        className={cx('search-bar__icon-btn')}
                        onClick={handleExpandSearch}
                        aria-label='Expand search'
                    >
                        <CiSearch size='2rem' />
                    </button>
                )}
                <div
                    className={cx('search-bar__group', {
                        'search-bar__group--active': isExpanded || props.alwaysExpand
                    })}
                    style={props.mobile ? { width: '100%' } : {}}
                >
                    <input
                        ref={inputRef}
                        type='text'
                        id='search'
                        className={cx('search-bar__input')}
                        value={searchValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder='Search...'
                        style={props.mobile ? { fontSize: '1.2rem', padding: '8px 0' } : {}}
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
