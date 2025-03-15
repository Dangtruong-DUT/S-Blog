import { useContext } from 'react'
import { SettingsContext } from 'src/contexts/settings.context'
import {
    MdLanguage,
    MdDarkMode,
    MdPersonOutline,
    MdSettings,
    MdLogout,
    MdLogin,
    MdAppRegistration
} from 'react-icons/md'
import { MenuItem } from 'src/types/Menu.type'
import { AppContext } from 'src/contexts/app.context'
import { routes } from 'src/config'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'

export function useMenuItems() {
    const { state, dispatch } = useContext(SettingsContext)
    const { isAuthenticated, setAuthenticated, setProfile } = useContext(AppContext)
    const navigate = useNavigate()
    const logoutMutation = useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            setAuthenticated(false)
            setProfile(null)
            navigate(routes.login)
        }
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }
    let MENU_ITEMS: MenuItem[] = []
    if (isAuthenticated) {
        MENU_ITEMS = [
            {
                icon: <MdPersonOutline size='1em' />,
                title: 'View profile',
                to: routes.me
            },
            {
                icon: <MdSettings size='1em' />,
                title: 'Settings',
                to: routes.setting
            },
            {
                icon: <MdLanguage size='1em' />,
                title: 'English',
                children: {
                    title: 'Language',
                    menuItems: [
                        {
                            code: 'en',
                            title: 'English',
                            active: state.language === 'en',
                            onClick: () => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })
                        },
                        {
                            code: 'vi',
                            title: 'Vietnamese',
                            active: state.language === 'vi',
                            onClick: () => dispatch({ type: 'SET_LANGUAGE', payload: 'vi' })
                        }
                    ]
                }
            },
            {
                icon: <MdDarkMode size='1em' />,
                title: 'Dark mode',
                children: {
                    title: 'Dark mode',
                    menuItems: [
                        {
                            title: 'Use device theme',
                            active: state.theme === 'system',
                            onClick: () => dispatch({ type: 'SET_THEME', payload: 'system' })
                        },
                        {
                            active: state.theme === 'dark',
                            onClick: () => dispatch({ type: 'SET_THEME', payload: 'dark' }),
                            title: 'Dark mode'
                        },
                        {
                            onClick: () => dispatch({ type: 'SET_THEME', payload: 'light' }),
                            title: 'Light mode',
                            active: state.theme === 'light'
                        }
                    ]
                }
            },
            {
                icon: <MdLogout size='1em' />,
                title: 'Log out',
                separate: true,
                onClick: handleLogout
            }
        ]
    } else
        MENU_ITEMS = [
            {
                icon: <MdLogin size='1em' />,
                title: 'Signin',
                to: routes.login
            },
            {
                icon: <MdAppRegistration size='1em' />,
                title: 'Register',
                to: routes.register
            },
            {
                icon: <MdLanguage size='1em' />,
                title: 'Language',
                children: {
                    title: 'Language',
                    menuItems: [
                        {
                            code: 'en',
                            title: 'English',
                            active: state.language === 'en',
                            onClick: () => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })
                        },
                        {
                            code: 'vi',
                            title: 'Vietnamese',
                            active: state.language === 'vi',
                            onClick: () => dispatch({ type: 'SET_LANGUAGE', payload: 'vi' })
                        }
                    ]
                }
            },
            {
                icon: <MdDarkMode size='1em' />,
                title: 'Dark mode',
                children: {
                    title: 'Dark mode',
                    menuItems: [
                        {
                            title: 'Use device theme',
                            active: state.theme === 'system',
                            onClick: () => dispatch({ type: 'SET_THEME', payload: 'system' })
                        },
                        {
                            active: state.theme === 'dark',
                            onClick: () => dispatch({ type: 'SET_THEME', payload: 'dark' }),
                            title: 'Dark mode'
                        },
                        {
                            onClick: () => dispatch({ type: 'SET_THEME', payload: 'light' }),
                            title: 'Light mode',
                            active: state.theme === 'light'
                        }
                    ]
                }
            }
        ]

    return MENU_ITEMS
}
