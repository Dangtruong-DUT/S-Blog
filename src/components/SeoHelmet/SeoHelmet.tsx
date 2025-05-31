/* eslint-disable @typescript-eslint/no-explicit-any */
import { Helmet } from 'react-helmet'

interface SeoProps {
    title: string
    description: string
    image?: string
    path: string
    type?: string
    keywords?: string
    author?: string
    publishedTime?: string
    modifiedTime?: string
    category?: string
    readingTime?: string
}

const SEO = ({
    title,
    description,
    image,
    path,
    type,
    keywords,
    author = 'S-Blog Team',
    publishedTime,
    modifiedTime,
    category,
    readingTime
}: SeoProps) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.sblog.tech'
    const fullUrl = `${siteUrl}${path || ''}`
    const defaultImage = `${siteUrl}/images/Thumbnail.png`
    const ogImage = image || defaultImage

    // Create structured data safely
    const createStructuredData = () => {
        try {
            if (type === 'article') {
                const data = {
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: title || '',
                    description: description || '',
                    image: {
                        '@type': 'ImageObject',
                        url: ogImage || '',
                        width: 1200,
                        height: 630
                    },
                    url: fullUrl || '',
                    author: {
                        '@type': 'Person',
                        name: author || 'S-Blog Team'
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'S-Blog',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${siteUrl}/icon/android-chrome-512x512.png`,
                            width: 512,
                            height: 512
                        }
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': fullUrl || ''
                    },
                    inLanguage: 'vi',
                    isPartOf: {
                        '@type': 'Blog',
                        name: 'S-Blog',
                        url: siteUrl
                    }
                } as Record<string, any>

                // Add optional fields
                if (category) {
                    data.about = {
                        '@type': 'Thing',
                        name: category
                    }
                    data.articleSection = category
                }

                if (readingTime) {
                    data.timeRequired = `PT${readingTime}M`
                }

                if (keywords) {
                    const keywordArray = keywords
                        .split(',')
                        .map((k) => k.trim())
                        .filter(Boolean)
                    if (keywordArray.length > 0) {
                        data.keywords = keywordArray
                    }
                }

                if (publishedTime) {
                    data.datePublished = publishedTime
                }

                if (modifiedTime) {
                    data.dateModified = modifiedTime
                }

                return data
            } else if (type === 'profile') {
                const data = {
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: author || 'S-Blog Team',
                    description: description || '',
                    image: {
                        '@type': 'ImageObject',
                        url: ogImage || '',
                        width: 400,
                        height: 400
                    },
                    url: fullUrl || '',
                    mainEntityOfPage: {
                        '@type': 'ProfilePage',
                        '@id': fullUrl || ''
                    },
                    sameAs: []
                } as Record<string, any>

                if (keywords) {
                    const knowledgeArray = keywords
                        .split(',')
                        .map((k) => k.trim())
                        .filter(Boolean)
                    if (knowledgeArray.length > 0) {
                        data.knowsAbout = knowledgeArray
                    }
                }

                return data
            }
            return null
        } catch (error) {
            console.warn('Error creating structured data:', error)
            return null
        }
    }

    const structuredData = createStructuredData()

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title || 'S-Blog'}</title>
            <meta name='description' content={description || 'S-Blog - Chia sẻ kiến thức'} />
            {keywords && <meta name='keywords' content={keywords} />}
            <meta name='author' content={author || 'S-Blog Team'} />
            <link rel='canonical' href={fullUrl} />

            {/* Open Graph Meta Tags */}
            <meta property='og:type' content={type || 'website'} />
            <meta property='og:title' content={title || 'S-Blog'} />
            <meta property='og:description' content={description || 'S-Blog - Chia sẻ kiến thức'} />
            <meta property='og:image' content={ogImage} />
            <meta property='og:image:alt' content={title || 'S-Blog'} />
            <meta property='og:url' content={fullUrl} />
            <meta property='og:site_name' content='S-Blog' />
            <meta property='og:locale' content='vi_VN' />

            {/* Twitter Meta Tags */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={title || 'S-Blog'} />
            <meta name='twitter:description' content={description || 'S-Blog - Chia sẻ kiến thức'} />
            <meta name='twitter:image' content={ogImage} />
            <meta name='twitter:image:alt' content={title || 'S-Blog'} />

            {/* Article specific meta tags */}
            {type === 'article' && publishedTime && <meta property='article:published_time' content={publishedTime} />}
            {type === 'article' && modifiedTime && <meta property='article:modified_time' content={modifiedTime} />}
            {type === 'article' && author && <meta property='article:author' content={author} />}

            {/* Additional SEO Meta Tags */}
            <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1' />
            <meta name='googlebot' content='index, follow, max-image-preview:large, max-snippet:-1' />
            <meta name='bingbot' content='index, follow' />

            {/* Performance & Loading Hints */}
            <meta name='format-detection' content='telephone=no' />
            <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            <link rel='dns-prefetch' href='//fonts.gstatic.com' />

            {/* Social Media Optimization */}
            {type === 'article' && category && <meta property='article:section' content={category} />}
            {type === 'article' && keywords && <meta property='article:tag' content={keywords} />}

            {/* Mobile Optimization */}
            <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=5.0' />
            <meta name='theme-color' content='#ff5480' />
            <meta name='color-scheme' content='light dark' />
            <meta name='mobile-web-app-capable' content='yes' />
            <meta name='apple-mobile-web-app-capable' content='yes' />
            <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />

            {/* Structured Data */}
            {structuredData && <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>}
        </Helmet>
    )
}

export default SEO
