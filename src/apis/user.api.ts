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
    > {
    password?: string
    newPassword?: string
}

const URL_GET_USER = '/api/users'
const URL_UPDATE_PROFILE = '/user'

const userApi = {
    getProfile(username: string) {
        return http.get<ResponseApi<User>>(`${URL_GET_USER}/${username}`)
    },
    updateProfile(body: BodyUpdateProfile) {
        return http.put<ResponseApi<User>>(URL_UPDATE_PROFILE, body)
    }
}

export default userApi
