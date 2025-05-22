import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

const URL_SOCIALS = import.meta.env.VITE_API_URL_SOCIALS

const SocialApi = {
    getSocial() {
        return http.get<ResponseApi<any>>(URL_SOCIALS)
    },
    updateSocial(body: any) {
        return http.post<ResponseApi<any>>(URL_SOCIALS, body)
    }
}

export default SocialApi
