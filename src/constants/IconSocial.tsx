import { JSX } from 'react'
import {
    FaEnvelope,
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaTiktok,
    FaTwitter,
    FaYoutube
} from 'react-icons/fa'

export const ICONS_WITH_COLOR: Record<string, { icon: JSX.Element; name: string }> = {
    'facebook.com': { icon: <FaFacebook size={45} color='#1877F2' />, name: 'Facebook' },
    'twitter.com': { icon: <FaTwitter size={45} color='#1DA1F2' />, name: 'Twitter' },
    'x.com': { icon: <FaTwitter size={45} color='#000' />, name: 'X' },
    'linkedin.com': { icon: <FaLinkedin size={45} color='#0077B5' />, name: 'LinkedIn' },
    'github.com': { icon: <FaGithub size={45} color='black' />, name: 'GitHub' },
    'instagram.com': { icon: <FaInstagram size={45} color='#E4405F' />, name: 'Instagram' },
    'tiktok.com': { icon: <FaTiktok size={45} color='#000' />, name: 'TikTok' },
    'youtube.com': { icon: <FaYoutube size={45} color='red' />, name: 'YouTube' },
    email: { icon: <FaEnvelope size={45} color='red' />, name: 'Email' }
} as const
