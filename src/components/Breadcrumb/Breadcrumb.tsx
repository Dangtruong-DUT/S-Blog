import { Helmet } from 'react-helmet'
import styles from './Breadcrumb.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface BreadcrumbItem {
    name: string
    url: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.sblog.tech'

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.url}`
        }))
    }

    return (
        <>
            <Helmet>
                <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>
            </Helmet>{' '}
            <nav aria-label='Breadcrumb' className={cx('breadcrumb')}>
                <ol className={cx('breadcrumb-list')}>
                    {items.map((item, index) => (
                        <li key={index} className={cx('breadcrumb-item')}>
                            <a href={item.url} className={cx('breadcrumb-link')}>
                                {item.name}
                            </a>
                            {index < items.length - 1 && (
                                <span className={cx('breadcrumb-separator')} aria-hidden='true'>
                                    {' '}
                                    ›{' '}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}

export default Breadcrumb
