import { FaInstagram, FaFacebookF, FaGithub, FaYoutube } from 'react-icons/fa'

const SOCIALS = [
    {
        href: 'https://www.instagram.com/nd.trg281/',
        icon: <FaInstagram />,
        label: 'Instagram'
    },
    {
        href: 'https://www.facebook.com/nd.trg281',
        icon: <FaFacebookF />,
        label: 'Facebook'
    },
    {
        href: 'https://github.com/Dangtruong-DUT',
        icon: <FaGithub />,
        label: 'GitHub'
    },
    {
        href: 'https://www.youtube.com/@truongnguyenang-ny4yv',
        icon: <FaYoutube />,
        label: 'YouTube'
    }
] as const

export default SOCIALS
