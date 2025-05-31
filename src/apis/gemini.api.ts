// Gemini AI Service
export interface GeminiRequest {
    contents: {
        parts: {
            text: string
        }[]
    }[]
}

export interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string
            }[]
        }
        finishReason: string
        index: number
        safetyRatings: {
            category: string
            probability: string
        }[]
    }[]
}

class GeminiService {
    private readonly apiKey: string
    private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!this.apiKey) {
            throw new Error('Gemini API key is not configured')
        }
    }

    async generateContent(prompt: string): Promise<string> {
        try {
            const requestBody: GeminiRequest = {
                contents: [
                    {
                        parts: [
                            {
                                text: this.createContextualPrompt(prompt)
                            }
                        ]
                    }
                ]
            }

            const response = await fetch(`${this.baseUrl}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
            }

            const data: GeminiResponse = await response.json()

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No response from Gemini AI')
            }

            return data.candidates[0].content.parts[0].text
        } catch (error) {
            console.error('Error calling Gemini API:', error)
            throw error
        }
    }

    private createContextualPrompt(userMessage: string): string {
        return `Bạn là một trợ lý ảo thông minh của S-Blog – nền tảng chia sẻ kiến thức công nghệ, lập trình, AI và các chủ đề tech khác.

      Thông tin website:
      - Người dùng có thể: tìm kiếm, viết bài, đăng nhập, thích bài viết, bình luận, chỉnh sửa hồ sơ cá nhân.
      - Các đường dẫn chính:
        • Trang chủ: https://www.sblog.tech/
        • Danh sách bài viết: https://www.sblog.tech/blogs
        • Viết bài: https://www.sblog.tech/blogs/create
        • Đăng nhập/đăng ký: https://www.sblog.tech/auth
      
      Vai trò của bạn:
      - Trả lời câu hỏi về cách sử dụng website.
      - Hỗ trợ viết và tối ưu nội dung blog.
      - Giải đáp vấn đề kỹ thuật hoặc hỗ trợ xử lý lỗi người dùng gặp phải.
      
      Luôn trả lời bằng tiếng Việt, ngắn gọn, thân thiện, dễ hiểu.
      
      Câu hỏi của người dùng: ${userMessage}`
    }
}

export const geminiService = new GeminiService()
