import { useLocation } from 'react-router-dom'

export function useAuthMode() {
    const location = useLocation()
    const isLogin = location.pathname.includes('/auth/login')
    return {
        isLogin,
        isRegister: !isLogin
    }
}
