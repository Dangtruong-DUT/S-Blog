import http from 'src/utils/https.util'
import { AuthResponse } from 'src/types/auth.type'

export const URL_LOGIN = '/auth/login'
export const URL_REGISTER = '/auth/register'
export const URL_LOGOUT = '/auth/logout'
export const URL_REFRESH_TOKEN = '/refresh-token'
const authApi = {
    registerAccount(body: { firstName: string; lastName: string; email: string; password: string }) {
        return http.post<AuthResponse>(URL_LOGIN, body)
    },
    login(body: { email: string; password: string }) {
        return http.post<AuthResponse>(URL_LOGIN, body)
    },

    logout() {
        return http.post(URL_LOGOUT)
    }
}

export default authApi
