import { User } from 'src/types/user.type'
import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

interface BodyUpdateProfile
    extends Omit<
        User,
        | 'id'
        | 'is_superuser'
        | 'is_staff'
        | 'date_joined'
        | 'email'
        | 'is_active'
        | 'isFollowing'
        | 'likes'
        | 'followers'
        | 'social_links'
    > {
    password?: string
    newPassword?: string
}

const URL_USER = import.meta.env.VITE_API_URL_USER

const userApi = {
    getProfile(id: string) {
        return http.get<ResponseApi<User>>(`${URL_USER}/${id}/`)
    },
    updateProfile({ body, userId }: { body: BodyUpdateProfile; userId: string }) {
        return http.put<ResponseApi<User>>(`${URL_USER}/${userId}/`, body)
    }
}

export default userApi
