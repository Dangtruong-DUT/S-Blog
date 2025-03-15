/* eslint-disable @typescript-eslint/no-explicit-any */
import Tippy from '@tippyjs/react'
import { CiSearch } from 'react-icons/ci'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import classNames from 'classnames/bind'
import styles from './SearchBar.module.scss'
import { useState, useRef } from 'react'
import PopperWrapper from 'src/components/Popper'

const cx = classNames.bind(styles)

function SearchBar() {
    const [query, setQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleBlur = () => {
        if (!query) setIsExpanded(false)
    }
    const searchResults: any[] = []
    const isFetching = false
    return (
        <Tippy
            interactive
            visible={isExpanded && searchResults.length > 0}
            render={(attrs) => (
                <div className={cx('search-results')} tabIndex={-1} {...attrs}>
                    <PopperWrapper>
                        {searchResults.map((result, index) => (
                            <div key={index} className={cx('search-result-item')}>
                                {result}
                            </div>
                        ))}
                    </PopperWrapper>
                </div>
            )}
        >
            <div className={cx('search-bar', { 'search-bar--expanded': isExpanded })}>
                <button
                    className={cx('search-bar__icon-btn')}
                    onClick={() => {
                        setIsExpanded(true)
                        setTimeout(() => inputRef.current?.focus(), 100)
                    }}
                    aria-label='Expand search'
                >
                    <CiSearch size={'2rem'} />
                </button>
                <div className={cx('search-bar__group', { 'search-bar__group--active': isExpanded })}>
                    <input
                        ref={inputRef}
                        type='text'
                        id='search'
                        className={cx('search-bar__input')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={handleBlur}
                    />
                    {query && (
                        <button
                            className={cx('search-bar__clear-btn')}
                            onClick={() => setQuery('')}
                            aria-label='Clear search'
                        >
                            {isFetching ? (
                                <AiOutlineLoading3Quarters size={'0.7rem'} className={cx('search-bar__loading-icon')} />
                            ) : (
                                <AiOutlineClose size={'1.3rem'} />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Tippy>
    )
}

export default SearchBar
