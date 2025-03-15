interface props {
    title: string
    url: string
}

function createSocialLink({ title, url }: props) {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.sblog.tech'
    const fullUrl = encodeURIComponent(`${siteUrl}/${url}`)
    const text = encodeURIComponent(title)

    const socialLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`,
        reddit: `https://www.reddit.com/submit?url=${fullUrl}&title=${text}`,
        whatsapp: `https://api.whatsapp.com/send?text=${text} ${fullUrl}`,
        telegram: `https://t.me/share/url?url=${fullUrl}&text=${text}`
    }
    return socialLinks
}

export default createSocialLink
