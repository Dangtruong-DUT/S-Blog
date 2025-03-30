import { ResponseApi } from 'src/types/utils.type'
import http from 'src/utils/https.util'
interface UploadImageData {
    image: string
}

const URL_UPLOAD_IMAGE = '/upload/image'

const uploadApi = {
    uploadImage(body: FormData) {
        return http.post<ResponseApi<UploadImageData>>(
            URL_UPLOAD_IMAGE,
            body,

            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
    }
}

export default uploadApi
