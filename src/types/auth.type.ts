import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type AuthResponse = ResponseApi<{
    accessToken: string
    refreshToken: string
    user: User
}>

export type RefreshTokenResponse = ResponseApi<{
    accessToken: string
}>
