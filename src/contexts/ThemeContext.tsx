import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const [theme, setTheme] = useState<'light' | 'dark'>(storedTheme ? storedTheme : 'light')

    useEffect(() => {
        localStorage.setItem('theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
