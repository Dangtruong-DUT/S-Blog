/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
    clearLS,
    getAccessToken,
    getRefreshToken,
    saveAccessTokenToLS,
    saveProfileToLS,
    saveRefreshTokenToLS
} from './aut.util'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/apis/auth.api'

class Http {
    instance: AxiosInstance
    private refreshTokenRequest: Promise<string> | null
    private accessToken: string | null

    constructor() {
        this.accessToken = getAccessToken()
        this.instance = axios.create({
            baseURL: 'http://localhost:5000',
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        })
        this.refreshTokenRequest = null

        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        this.instance.interceptors.response.use(
            (response) => {
                const { url } = response.config
                if (url === URL_LOGIN || url === URL_REGISTER) {
                    const { accessToken, refreshToken, user } = (response.data as AuthResponse).data
                    this.accessToken = accessToken
                    saveAccessTokenToLS(accessToken)
                    saveRefreshTokenToLS(refreshToken)
                    saveProfileToLS(user)
                } else if (url === URL_LOGOUT) {
                    clearLS()
                }
                return response
            },
            async (error: AxiosError) => {
                const originalRequest = error.config

                if (
                    error.response?.status === HttpStatusCode.Unauthorized &&
                    (error.response?.data as any)?.message === 'EXPIRED_ACCESS_TOKEN' &&
                    originalRequest
                ) {
                    if (!this.refreshTokenRequest) {
                        this.refreshTokenRequest = refreshToken().finally(() => {
                            this.refreshTokenRequest = null
                        })
                    }

                    try {
                        const access_token = await this.refreshTokenRequest
                        this.accessToken = access_token
                        saveAccessTokenToLS(access_token)
                        originalRequest.headers.Authorization = `Bearer ${access_token}`
                        return this.instance(originalRequest)
                    } catch (errorRefreshToken) {
                        return Promise.reject(errorRefreshToken)
                    }
                }

                if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
                    const message = (error.response?.data as any)?.message || error.message
                    toast.error(message)
                }
                return Promise.reject(error)
            }
        )
    }
}

const http = new Http().instance

const refreshToken = async (): Promise<string> => {
    const refresh_token = getRefreshToken()
    if (!refresh_token) {
        throw new Error('No refresh token available')
    }

    try {
        const res = await http.post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refresh_token })
        const { accessToken } = res.data.data
        saveAccessTokenToLS(accessToken)
        return accessToken
    } catch (error) {
        clearLS()
        throw (error as AxiosError).response
    }
}

export default http
