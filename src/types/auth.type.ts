import { User } from './user.type'
import { ResponseApi } from './utils.type'

export type AuthResponse = ResponseApi<{
    access_token: string
    refresh_token: string
    user: User
}>

export type RefreshTokenResponse = ResponseApi<{
    access_token: string
}>

export interface RegisterReqBody {
    first_name: string
    last_name: string
    email: string
    password: string
}

export interface LoginReqBody {
    email: string
    password: string
}
