import {
    MdCreate,
    MdLanguage,
    MdLightbulbOutline,
    MdFeedback,
    MdDarkMode,
    MdPersonOutline,
    MdMonetizationOn,
    MdBusinessCenter,
    MdSettings,
    MdInfoOutline,
    MdLogout
} from 'react-icons/md'
import { MenuItem } from 'src/types/Menu.type'

const MENU_ITEMS: MenuItem[] = [
    {
        icon: <MdCreate size='1em' />,
        title: 'Creator tools',
        children: {
            title: 'Creator tools',
            menuItems: [
                {
                    icon: <MdLightbulbOutline size='1em' />,
                    title: 'LIVE Creator Hub'
                }
            ]
        }
    },
    {
        icon: <MdLanguage size='1em' />,
        title: 'English',
        children: {
            title: 'Language',
            menuItems: [
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                }
            ]
        }
    },
    {
        icon: <MdFeedback size='1em' />,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <MdDarkMode size='1em' />,
        title: 'Dark mode',
        children: {
            title: 'Dark mode',
            menuItems: [
                {
                    title: 'Use device theme'
                },
                {
                    title: 'Dark mode'
                },
                {
                    title: 'Light mode'
                }
            ]
        }
    }
] as const

const USER_MENU = [
    {
        icon: <MdPersonOutline size='1em' />,
        title: 'View profile',
        to: '/profile'
    },
    {
        icon: <MdMonetizationOn size='1em' />,
        title: 'Get Coins',
        to: '/get-coins'
    },
    {
        icon: <MdCreate size='1em' />,
        title: 'Creator tools',
        children: {
            title: 'Creator tools',
            menuItems: [
                {
                    icon: <MdLightbulbOutline size='1em' />,
                    title: 'LIVE Creator Hub'
                }
            ]
        }
    },
    {
        icon: <MdBusinessCenter size='1em' />,
        title: 'Business Suite',
        to: '/business- Suite'
    },
    {
        icon: <MdSettings size='1em' />,
        title: 'Settings',
        to: '/settings'
    },
    {
        icon: <MdLanguage size='1em' />,
        title: 'English',
        children: {
            title: 'Language',
            menuItems: [
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                },
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                }
            ]
        }
    },
    {
        icon: <MdInfoOutline size='1em' />,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <MdDarkMode size='1em' />,
        title: 'Dark mode',
        children: {
            title: 'Dark mode',
            menuItems: [
                {
                    title: 'Use device theme'
                },
                {
                    title: 'Dark mode'
                },
                {
                    title: 'Light mode'
                }
            ]
        }
    },
    {
        icon: <MdLogout size='1em' />,
        title: 'Log out',
        to: '/logout',
        separate: true
    }
] as const

export { MENU_ITEMS, USER_MENU }
