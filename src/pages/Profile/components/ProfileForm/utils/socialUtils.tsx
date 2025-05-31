import { FaFacebook, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import { SocialField } from '../components/SocialLinksManager/SocialLinksManager'

export const getSocialIcon = (url: string) => {
    if (url?.includes('facebook.com')) return <FaFacebook />
    if (url?.includes('instagram.com')) return <FaInstagram />
    if (url?.includes('twitter.com')) return <FaTwitter />
    if (url?.includes('youtube.com')) return <FaYoutube />
    if (url?.includes('linkedin.com')) return <FaLinkedin />
    if (url?.includes('github.com')) return <FaGithub />
    if (url?.includes('tiktok.com')) return <FaTiktok />
    return <FaGlobe />
}

export const validateSocialLink = (
    link: string,
    socialFields: SocialField[],
    currentId?: string
): string | undefined => {
    if (!link.trim()) return 'Link cannot be empty'

    try {
        const url = new URL(link)
        if (!['http:', 'https:'].includes(url.protocol)) {
            return 'URL must start with http:// or https://'
        }
    } catch {
        return 'Invalid URL format'
    }

    // Check for duplicates (ignore current item)
    const isDuplicate = socialFields.some(
        (field) => field.link.trim().toLowerCase() === link.trim().toLowerCase() && field.id !== currentId
    )

    if (isDuplicate) return 'Duplicate link'

    return undefined
}

export const generateLocalId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
