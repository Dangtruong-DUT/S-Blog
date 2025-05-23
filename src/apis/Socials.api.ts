import { SocialType } from 'src/types/social.type'
import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

const URL_SOCIALS = import.meta.env.VITE_API_URL_SOCIALS

const SocialApi = {
    getSocials() {
        return http.get<ResponseApi<SocialType[]>>(`${URL_SOCIALS}/`)
    },
    addSocial(body: { link: string }) {
        return http.post<ResponseApi<SocialType>>(`${URL_SOCIALS}/`, body)
    },
    deleteSocial(id: string) {
        return http.delete<ResponseApi<SocialType>>(`${URL_SOCIALS}/${id}/`)
    },
    updateSocial(id: string, body: { link: string }) {
        return http.put<ResponseApi<SocialType>>(`${URL_SOCIALS}/${id}/`, body)
    }
}

export default SocialApi
