import { createContext, useReducer, useEffect, ReactNode } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'

interface SettingsState {
    theme: ThemeMode
    language: string
}

type SettingsAction =
    | { type: 'SET_THEME'; payload: ThemeMode }
    | { type: 'SET_LANGUAGE'; payload: string }
    | { type: 'TOGGLE_THEME' }

const initialState: SettingsState = {
    theme: (localStorage.getItem('theme') as ThemeMode) || 'system',
    language: localStorage.getItem('language') || 'en'
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
    switch (action.type) {
        case 'TOGGLE_THEME': {
            const newTheme = state.theme == 'dark' ? 'light' : 'dark'
            localStorage.setItem('theme', newTheme)
            return { ...state, theme: newTheme }
        }
        case 'SET_THEME':
            localStorage.setItem('theme', action.payload)
            return { ...state, theme: action.payload }
        case 'SET_LANGUAGE':
            localStorage.setItem('language', action.payload)
            return { ...state, language: action.payload }
        default:
            return state
    }
}

export const SettingsContext = createContext<{
    state: SettingsState
    dispatch: React.Dispatch<SettingsAction>
}>({ state: initialState, dispatch: () => null })

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(settingsReducer, initialState)

    useEffect(() => {
        localStorage.setItem('theme', state.theme)

        const isDark =
            state.theme === 'dark' ||
            (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }, [state.theme])

    return <SettingsContext.Provider value={{ state, dispatch }}>{children}</SettingsContext.Provider>
}
