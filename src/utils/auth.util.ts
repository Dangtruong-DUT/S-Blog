import { User } from 'src/types/user.type'

export const saveAccessTokenToLS = (accessToken: string) => {
    localStorage.setItem('access_token', accessToken)
}
export const saveRefreshTokenToLS = (refreshToken: string) => {
    localStorage.setItem('refresh_token', refreshToken)
}
export const getAccessToken = () => {
    return localStorage.getItem('access_token')
}
export const getRefreshToken = () => {
    return localStorage.getItem('refresh_token')
}

export const getProfileFromLS = (): User | null => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const saveProfileToLS = (body: User) => {
    localStorage.setItem('user', JSON.stringify(body))
}
export const clearLS = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
}
