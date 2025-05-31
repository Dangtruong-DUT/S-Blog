export const Config = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
    MAX_SIZE_UPLOAD_IMAGE: 10485760 // 10 * 1024 * 1024
} as const
