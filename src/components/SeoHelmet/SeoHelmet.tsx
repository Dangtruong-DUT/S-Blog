import { Helmet } from 'react-helmet'

interface SeoProps {
    title: string
    description: string
    image?: string
    path: string
    type?: string
}

const SEO = ({ title, description, image, path, type }: SeoProps) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.sblog.tech'
    const fullUrl = `${siteUrl}${path || ''}`

    return (
        <Helmet>
            <meta property='og:type' content={type || (path?.includes('/blog/') ? 'article' : 'website')} />
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:image' content={image} />
            <meta property='og:url' content={fullUrl} />
            <title>{title}</title>
        </Helmet>
    )
}

export default SEO
