import { FaFacebookF, FaTwitter, FaTelegramPlane } from 'react-icons/fa'
import styles from './BlogSidebar.module.scss'
import classNames from 'classnames/bind'
import { memo } from 'react'

const cx = classNames.bind(styles)

interface BlogSidebarProps {
    social: {
        facebook: string
        twitter: string
        linkedin: string
        reddit: string
        whatsapp: string
        telegram: string
    } | null
}

const SOCIAL_ICONS = [
    { key: 'facebook', icon: <FaFacebookF size='2rem' /> },
    { key: 'twitter', icon: <FaTwitter size='2rem' /> },
    { key: 'telegram', icon: <FaTelegramPlane size='2rem' /> }
]

function BlogSidebar({ social }: BlogSidebarProps) {
    if (!social) return null

    return (
        <aside className={cx('sidebar')}>
            {SOCIAL_ICONS.map(({ key, icon }) => {
                const url = social[key as keyof typeof social]
                if (!url) return null

                return (
                    <a key={key} href={url} className={cx('sidebar-item')} target='_blank' rel='noopener noreferrer'>
                        {icon}
                    </a>
                )
            })}
        </aside>
    )
}

export default memo(BlogSidebar)
