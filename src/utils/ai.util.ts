import { AIAction } from '@/types/ai.type'
import { ContentField } from '@/types/ai.types'

export const detectAction = (content: string): AIAction => {
    const lowerContent = content.toLowerCase()

    if (
        lowerContent.includes('sửa') ||
        lowerContent.includes('edit') ||
        lowerContent.includes('chỉnh sửa') ||
        lowerContent.includes('fix')
    ) {
        return 'edit'
    }

    if (
        lowerContent.includes('kiểm tra') ||
        lowerContent.includes('spellcheck') ||
        lowerContent.includes('chính tả') ||
        lowerContent.includes('grammar')
    ) {
        return 'spellcheck'
    }

    if (
        lowerContent.includes('cải thiện') ||
        lowerContent.includes('improve') ||
        lowerContent.includes('tối ưu') ||
        lowerContent.includes('enhance')
    ) {
        return 'improve'
    }

    return 'suggest'
}

export const detectContentField = (content: string, fullResponse: string): ContentField => {
    const lowerContent = content.toLowerCase()
    const lowerResponse = fullResponse.toLowerCase()

    // Check for explicit field indicators
    if (lowerResponse.includes('tiêu đề') || lowerResponse.includes('title')) {
        return 'title'
    }
    if (lowerResponse.includes('mô tả') || lowerResponse.includes('description')) {
        return 'description'
    }
    if (lowerResponse.includes('nội dung') || lowerResponse.includes('content')) {
        return 'content'
    }

    // Analyze content characteristics
    if (content.length < 100 && !content.includes('\n')) {
        // Short, single-line content - likely title
        return 'title'
    } else if (content.length < 300 && content.split('\n').length <= 3) {
        // Medium length, few lines - likely description
        return 'description'
    } else if (lowerContent.includes('#') || content.length > 200) {
        // Has markdown headers or long content - likely main content
        return 'content'
    } else if (content.length > 50) {
        return 'description'
    } else {
        return 'title'
    }
}

export const validateContentForField = (content: string, field: ContentField): boolean => {
    switch (field) {
        case 'title':
            return content.length >= 20 && content.length <= 100
        case 'description':
            return content.length >= 50 && content.length <= 300
        case 'content':
            return content.length >= 100
        default:
            return true
    }
}

export const getContentQualityScore = (field: ContentField, content: string): number => {
    let score = 0

    switch (field) {
        case 'title':
            if (content.length >= 40 && content.length <= 60) score += 2
            if (/^[A-Z0-9]/.test(content)) score += 1 // Starts with capital letter or number
            if (content.includes('?') || content.includes('!')) score += 1 // Has engaging punctuation
            break

        case 'description':
            if (content.length >= 120 && content.length <= 160) score += 2
            if (content.includes('...')) score += 1 // Has continuation
            if (/bạn|bạn đọc|độc giả/.test(content.toLowerCase())) score += 1 // Has reader engagement
            break

        case 'content':
            if (content.length >= 800) score += 2
            if ((content.match(/#{2,3}/g) || []).length >= 3) score += 2 // Has multiple headings
            if (content.includes('Ví dụ:') || content.includes('Ví dụ như:')) score += 1
            if (content.toLowerCase().includes('kết luận') || content.toLowerCase().includes('tóm lại')) score += 1
            break
    }

    return score
}

// Create field-specific prompts
export const getFieldPrompt = (field: ContentField) => {
    const basePrompt = `Bạn là một AI assistant chuyên hỗ trợ viết blog. Hãy luôn trả lời bằng tiếng Việt và đưa ra các gợi ý cụ thể.

QUAN TRỌNG - CẤU TRÚC PHẢN HỒI:
Bạn PHẢI chia phản hồi thành 2 phần riêng biệt:

**PHẦN 1 - PHÂN TÍCH & GỢI Ý:**
- Phân tích yêu cầu của người dùng
- Đưa ra các nhận xét, gợi ý chung
- Giải thích lý do lựa chọn
- Đặt câu hỏi nếu cần thêm thông tin

**PHẦN 2 - NỘI DUNG ÁP DỤNG:**
Sau khi hoàn thành phần 1, bạn PHẢI viết dòng:
"--- NỘI DUNG ÁP DỤNG ---"

Rồi đưa ra nội dung CỤ THỂ có thể áp dụng trực tiếp vào form, KHÔNG có thêm bất kỳ giải thích nào khác.
Nội dung này phải:
- Chỉ là nội dung thuần túy để điền vào trường
- Không có tiêu đề phụ, không có giải thích thêm
- Sẵn sàng copy-paste vào form`

    const fieldPrompts = {
        title: `${basePrompt}
Bạn đang hỗ trợ viết TIÊU ĐỀ blog. Trong phần NỘI DUNG ÁP DỤNG, hãy đưa ra 3-5 gợi ý tiêu đề, mỗi tiêu đề trên một dòng riêng biệt. Mỗi tiêu đề phải:
- Độ dài 40-60 ký tự
- Chứa từ khóa chính  
- Tạo sự tò mò cho người đọc
- Tối ưu SEO`,

        description: `${basePrompt}
Bạn đang hỗ trợ viết MÔ TẢ blog. Trong phần NỘI DUNG ÁP DỤNG, hãy đưa ra 2-3 gợi ý mô tả, mỗi mô tả trên một dòng riêng. Mỗi mô tả phải:
- Độ dài 120-160 ký tự
- Tóm tắt nội dung chính
- Có call-to-action thu hút
- Chứa từ khóa tự nhiên`,

        content: `${basePrompt}
Bạn đang hỗ trợ viết NỘI DUNG blog. Trong phần NỘI DUNG ÁP DỤNG, hãy đưa ra nội dung hoàn chỉnh với:
- Cấu trúc heading rõ ràng (H2, H3)
- Độ dài tối thiểu 800 từ
- Phần mở đầu, thân bài, kết luận
- Ví dụ minh họa cụ thể
- Format Markdown chuẩn`
    }

    return fieldPrompts[field] || ''
}

export const getInputPlaceholder = (field: ContentField): string => {
    switch (field) {
        case 'title':
            return 'Nhập chủ đề để được gợi ý tiêu đề hấp dẫn...'
        case 'description':
            return 'Nhập yêu cầu để được gợi ý mô tả thu hút...'
        case 'content':
            return 'Nhập chủ đề hoặc yêu cầu về nội dung bài viết...'
        default:
            return 'Hỏi AI về tiêu đề, mô tả, nội dung blog...'
    }
}

export const getQuickAction = (field: ContentField, category?: string, title?: string) => {
    switch (field) {
        case 'title':
            return `Hãy gợi ý 3 tiêu đề hấp dẫn, SEO-friendly cho blog về chủ đề "${
                category || 'chưa có'
            }". Mỗi tiêu đề cần:
- Độ dài 40-60 ký tự
- Có từ khóa chính
- Tạo sự tò mò cho người đọc`
        case 'description':
            return `Dựa trên tiêu đề "${title || 'chưa có'}", hãy viết mô tả blog:
- Độ dài 120-160 ký tự
- Tóm tắt nội dung chính
- Có call-to-action`
        case 'content':
            return `Viết nội dung blog chi tiết cho tiêu đề "${title || 'chưa có'}" với:
- Cấu trúc heading rõ ràng
- Ví dụ minh họa
- Kết luận tóm tắt`
        default:
            return ''
    }
}
