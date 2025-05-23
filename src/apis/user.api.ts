import { User } from 'src/types/user.type'
import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'

type BodyUpdateProfile = Omit<
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
    | 'total_likes'
    | 'followers_count'
>
type ChangePasswordReqBody = {
    old_password: string
    new_password: string
    confirm_password: string
}

const URL_USER = import.meta.env.VITE_API_URL_USER
const URL_CHANGE_PASSWORD = import.meta.env.VITE_API_URL_CHANGE_PASSWORD

const userApi = {
    getProfile(id: string) {
        return http.get<ResponseApi<User>>(`${URL_USER}/${id}/`)
    },
    updateProfile({ body, userId }: { body: BodyUpdateProfile; userId: string }) {
        return http.put<ResponseApi<User>>(`${URL_USER}/${userId}/`, body)
    },
    followUser(id: string) {
        return http.post<ResponseApi<User>>(`${URL_USER}/${id}/follow/`)
    },
    unFollowUser(id: string) {
        return http.post<ResponseApi<User>>(`${URL_USER}/${id}/unfollow/`)
    },
    changePassword(body: ChangePasswordReqBody) {
        return http.post<ResponseApi<User>>(`${URL_CHANGE_PASSWORD}`, body)
    }
}

export default userApi
