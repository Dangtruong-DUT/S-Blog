import http from 'src/utils/https.util'
import { AuthResponse, LoginReqBody, RegisterReqBody } from 'src/types/auth.type'
import { getRefreshToken } from 'src/utils/auth.util'

export const URL_LOGIN = import.meta.env.VITE_API_URL_LOGIN
export const URL_REGISTER = import.meta.env.VITE_API_URL_REGISTER
export const URL_LOGOUT = import.meta.env.VITE_API_URL_LOGOUT
export const URL_REFRESH_TOKEN = import.meta.env.VITE_API_URL_REFRESH_TOKEN

const authApi = {
    registerAccount(body: RegisterReqBody) {
        return http.post<AuthResponse>(URL_REGISTER, body)
    },
    login(body: LoginReqBody) {
        return http.post<AuthResponse>(URL_LOGIN, body)
    },

    logout() {
        const refresh_token = getRefreshToken()
        return http.post(URL_LOGOUT, {
            refresh_token
        })
    }
}

export default authApi
