import { memo, useRef, useEffect, ReactNode, useState } from 'react'
import styles from './TabBar.module.scss'
import classNames from 'classnames/bind'
import { NavLink, useLocation } from 'react-router-dom'

const cx = classNames.bind(styles)

interface tab {
    id: string | number
    name: string
    icon?: ReactNode
}
type TabBarProps = {
    typeTab: 'NavLink' | 'button'
    tabs: tab[]
    idIndexDefault: string | number
    getActiveIndex?: (id: string | number) => void
}

function TabBar({ tabs, idIndexDefault, getActiveIndex, typeTab = 'NavLink' }: TabBarProps) {
    const [activeIndex, setActiveIndex] = useState<string | number>(idIndexDefault)
    const underlineRef = useRef<HTMLDivElement>(null)
    const location = useLocation()

    const updateUnderline = (element: HTMLElement | null) => {
        if (element && underlineRef.current) {
            underlineRef.current.style.width = `${element.offsetWidth}px`
            underlineRef.current.style.left = `${element.offsetLeft}px`
        }
    }

    useEffect(() => {
        const activeTabElement = document.querySelector(`.${styles.tabFeed}.${styles.active}`) as HTMLElement | null
        updateUnderline(activeTabElement)
    }, [location.pathname])

    const handleMouseEnter = (tabId: string | number) => {
        const hoveredTabElement = document.querySelector(`[data-key="${tabId}"]`) as HTMLElement | null
        updateUnderline(hoveredTabElement)
    }

    const handleMouseLeave = () => {
        const activeTabElement = document.querySelector(`.${styles.tabFeed}.${styles.active}`) as HTMLElement | null
        updateUnderline(activeTabElement)
    }

    return (
        <nav className={cx('wrapper')}>
            <ul className={cx('tabBar')}>
                {tabs.map((tab) => (
                    <li key={tab.id}>
                        {typeTab === 'NavLink' ? (
                            <NavLink
                                data-key={tab.id}
                                to={idIndexDefault == tab.id ? '' : tab.name}
                                end
                                className={({ isActive }) => cx('tabFeed', { active: isActive })}
                                onMouseEnter={() => {
                                    handleMouseEnter(tab.id)
                                    if (typeof getActiveIndex == 'function') getActiveIndex(tab.id)
                                }}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span>{tab.name}</span>
                            </NavLink>
                        ) : (
                            <button
                                data-key={tab.id}
                                className={cx('tabFeed', { active: activeIndex === tab.id })}
                                onClick={() => {
                                    setActiveIndex(tab.id)
                                    if (typeof getActiveIndex == 'function') getActiveIndex(tab.id)
                                }}
                                onMouseEnter={() => handleMouseEnter(tab.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span>{tab.name}</span>
                            </button>
                        )}
                    </li>
                ))}
                <div ref={underlineRef} className={cx('underline')}></div>
            </ul>
        </nav>
    )
}

export default memo(TabBar)
