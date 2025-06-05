import { useState, useRef, useEffect } from 'react'
import {
    HiSparkles,
    HiXMark,
    HiCheck,
    HiArrowPath,
    HiPencilSquare,
    HiChatBubbleBottomCenterText,
    HiClipboardDocument,
    HiPaperAirplane
} from 'react-icons/hi2'
import classNames from 'classnames/bind'
import styles from './ChatAIAssistant.module.scss'
import ContentFieldSelector from './ContentFieldSelector'
import { ContentField } from 'src/constants/prompts'
import { geminiService } from 'src/apis/gemini.api'
import { convertMarkdownToQuill, convertQuillToText, convertQuillToPreview } from 'src/utils/convertMarkdownToQuill'
import MarkdownRenderer from '../MarkdownRenderer'

const cx = classNames.bind(styles)

interface ChatAIAssistantProps {
    isOpen: boolean
    onToggle: () => void
    formData: {
        title?: string
        description?: string
        content?: string
        category?: string
    }
    onApplyToField: (field: 'title' | 'description' | 'content', value: string, mode?: 'replace' | 'append') => void
}

interface ChatMessage {
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    suggestions?: AIResponse[]
}

interface AIResponse {
    field: 'title' | 'description' | 'content'
    content: string
    action: 'suggest' | 'edit' | 'spellcheck' | 'improve'
    reasoning: string
}

const ChatAIAssistant = ({ isOpen, onToggle, formData, onApplyToField }: ChatAIAssistantProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedField, setSelectedField] = useState<ContentField>('title')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen]) // Helper function to format AI response for display
    const formatAIResponseForDisplay = (content: string): string => {
        // Ẩn phần "--- NỘI DUNG ÁP DỤNG ---" và nội dung sau đó khỏi display
        const separatorPatterns = [
            /---\s*NỘI DUNG ÁP DỤNG\s*---/i,
            /---\s*ÁP DỤNG\s*---/i,
            /---\s*CONTENT\s*---/i,
            /NỘI DUNG ÁP DỤNG:/i,
            /ÁP DỤNG:/i
        ]

        let displayContent = content

        for (const pattern of separatorPatterns) {
            const match = content.match(pattern)
            if (match) {
                // Chỉ hiển thị phần trước separator
                displayContent = content.slice(0, match.index).trim()
                break
            }
        }

        return displayContent
    } // Helper function to check if content is Quill Delta format
    const isQuillContent = (content: string): boolean => {
        try {
            const parsed = JSON.parse(content)
            return parsed && parsed.ops && Array.isArray(parsed.ops)
        } catch {
            return false
        }
    } // Helper function to normalize Quill content

    // Helper function to render content preview for Quill
    const renderQuillContentPreview = (content: string): React.JSX.Element => {
        const preview = convertQuillToPreview(content, 200)
        return <p className={cx('quill-preview')}>{preview}</p>
    }

    // Enhanced function to render suggestion content
    const renderSuggestionContent = (suggestion: AIResponse): React.JSX.Element => {
        // Special rendering for content field suggestions
        if (suggestion.field === 'content') {
            if (isQuillContent(suggestion.content)) {
                return renderQuillContentPreview(suggestion.content)
            }
            // For markdown content, show preview with max height
            return (
                <div className={cx('content-preview')}>
                    <MarkdownRenderer content={suggestion.content} className={cx('suggestion-text')} />
                </div>
            )
        }

        // For title and description, show as is
        return <p className={cx('suggestion-text')}>{suggestion.content}</p>
    } // Improved AI response parsing to better separate analysis from applicable content
    const parseAIResponse = (content: string): AIResponse[] => {
        const responses: AIResponse[] = []

        // Find either the explicit section separator or analyze content structure
        const separatorPatterns = [
            /---+\s*(?:NỘI DUNG ÁP DỤNG|ÁP DỤNG|CONTENT)\s*---+/i,
            /(?:NỘI DUNG ÁP DỤNG|ÁP DỤNG|CONTENT)\s*:/i
        ]

        // Try to find content after known separator patterns first
        let applicableContent = ''
        let foundSeparator = false

        // First try to find explicit sections with separators
        for (const pattern of separatorPatterns) {
            const match = content.match(pattern)
            if (match) {
                const splitIndex = match.index! + match[0].length
                applicableContent = content.slice(splitIndex).trim()
                foundSeparator = true
                break
            }
        } // Nếu tìm thấy phần nội dung áp dụng
        if (foundSeparator && applicableContent.length > 10) {
            const field = detectContentField(applicableContent, content)
            const action = detectAction(content)

            // Xử lý nhiều gợi ý cho title và description (mỗi dòng là một gợi ý)
            if (field === 'title' || field === 'description') {
                // Tách các dòng và tìm các suggestions
                const lines = applicableContent
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)

                // Lọc ra các dòng là suggestions thực sự (không phải metadata)
                const suggestions = lines.filter((line) => {
                    // Bỏ qua các dòng metadata                // First check if the line is metadata or separator
                    const metadataPatterns = [
                        /^(?:---|===)/, // Section dividers
                        /^[#*•-]\s/, // List markers and headers
                        /^(?:gợi ý|áp dụng|nội dung|phân tích|tiêu đề|mô tả|ví dụ|lưu ý|chú ý|suggestion|note):/i,
                        /^(?:gợi ý|áp dụng|nội dung|phân tích|tiêu đề|mô tả)\s+(?:về|cho|của)/i
                    ]

                    // Skip metadata lines and very short lines
                    if (line.length < 15 || metadataPatterns.some((pattern) => pattern.test(line.toLowerCase()))) {
                        return false
                    }

                    // Kiểm tra độ dài phù hợp với field
                    if (field === 'title') {
                        return line.length >= 20 && line.length <= 100
                    } else if (field === 'description') {
                        return line.length >= 50 && line.length <= 300
                    }

                    return true
                })

                // Thêm từng suggestion hợp lệ
                suggestions.forEach((suggestion, index) => {
                    if (validateContentForField(suggestion, field)) {
                        responses.push({
                            field,
                            content: suggestion,
                            action,
                            reasoning: `AI suggestion ${index + 1} for ${field}`
                        })
                    }
                })

                // Nếu không tìm thấy suggestions trong lines, thử lấy toàn bộ nội dung
                if (responses.length === 0 && validateContentForField(applicableContent, field)) {
                    responses.push({
                        field,
                        content: applicableContent,
                        action,
                        reasoning: `AI suggestion for ${field}`
                    })
                }
            } else {
                // Cho content field, sử dụng toàn bộ nội dung
                if (validateContentForField(applicableContent, field)) {
                    responses.push({
                        field,
                        content: applicableContent,
                        action,
                        reasoning: `AI suggestion for ${field}`
                    })
                }
            }
        } // Try to extract content from quotes in the analysis section if no separator found
        if (responses.length === 0 && !foundSeparator) {
            // Look for content in quotes that appears to be suggestions
            const quotedContentPattern = /"([^"]{15,})"|`([^`]{15,})`|'([^']{15,})'/g
            const matches = [...content.matchAll(quotedContentPattern)]

            for (const match of matches) {
                const extractedContent = (match[1] || match[2] || match[3]).trim()

                // Skip if it looks like analysis text rather than a suggestion
                if (
                    extractedContent.toLowerCase().includes('ví dụ') ||
                    extractedContent.toLowerCase().includes('như là') ||
                    extractedContent.toLowerCase().includes('phân tích') ||
                    extractedContent.toLowerCase().includes('gợi ý')
                ) {
                    continue
                }

                const field = detectContentField(extractedContent, content)
                const action = detectAction(content)

                if (validateContentForField(extractedContent, field)) {
                    responses.push({
                        field,
                        content: extractedContent,
                        action,
                        reasoning: `AI suggestion found in quotes for ${field}`
                    })
                }
            }
        } // Fallback: Tìm nội dung trong dấu ngoặc vuông [content] nếu không có separator
        if (responses.length === 0) {
            const bracketMatches = content.match(/\[([^\]]+)\]/g)
            if (bracketMatches) {
                bracketMatches.forEach((match: string) => {
                    const extractedContent = match.slice(1, -1).trim()
                    if (extractedContent.length > 10) {
                        const field = detectContentField(extractedContent, content)
                        const action = detectAction(content)

                        if (validateContentForField(extractedContent, field)) {
                            responses.push({
                                field,
                                content: extractedContent,
                                action,
                                reasoning: `AI suggestion for ${field}`
                            })
                        }
                    }
                })
            }
        } // Final fallback: Try to identify usable content blocks based on structure
        if (responses.length === 0) {
            const paragraphs = content.split('\n\n').map((p) => p.trim())

            for (const paragraph of paragraphs) {
                // Skip very short paragraphs and those that look like analysis
                if (
                    paragraph.length < 40 ||
                    /^(?:phân tích|gợi ý|nhận xét|lưu ý|chú ý):/i.test(paragraph) ||
                    paragraph.startsWith('-') ||
                    paragraph.startsWith('*')
                ) {
                    continue
                }

                // Look for structured content (markdown headers, long paragraphs)
                if (
                    paragraph.includes('##') ||
                    paragraph.includes('###') ||
                    paragraph.length > 200 ||
                    /^[A-Z0-9][^.!?]+[.!?]/.test(paragraph)
                ) {
                    const cleanContent = paragraph.replace(/^(đây là|here is|nội dung|content)[:\s]*/i, '').trim()

                    const field = detectContentField(cleanContent, content)
                    if (validateContentForField(cleanContent, field)) {
                        responses.push({
                            field,
                            content: cleanContent,
                            action: detectAction(content),
                            reasoning: 'Detected structured content block'
                        })
                        break // Only use the first good content block
                    }
                }
            }
        }

        // Loại bỏ trùng lặp và sắp xếp theo độ ưu tiên
        const uniqueResponses = responses.filter(
            (response, index, self) =>
                index === self.findIndex((r) => r.field === response.field && r.content === response.content)
        )

        return uniqueResponses.sort((a, b) => {
            const priorityOrder = { content: 3, title: 2, description: 1 }
            const priorityDiff = priorityOrder[b.field] - priorityOrder[a.field]
            if (priorityDiff !== 0) return priorityDiff
            return getContentQualityScore(b) - getContentQualityScore(a)
        })
    } // Validate content for specific field
    const validateContentForField = (content: string, field: 'title' | 'description' | 'content'): boolean => {
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

    // Get content quality score
    const getContentQualityScore = (response: AIResponse): number => {
        let score = 0

        switch (response.field) {
            case 'title':
                if (response.content.length >= 40 && response.content.length <= 60) score += 2
                if (/^[A-Z0-9]/.test(response.content)) score += 1 // Starts with capital letter or number
                if (response.content.includes('?') || response.content.includes('!')) score += 1 // Has engaging punctuation
                break

            case 'description':
                if (response.content.length >= 120 && response.content.length <= 160) score += 2
                if (response.content.includes('...')) score += 1 // Has continuation
                if (/bạn|bạn đọc|độc giả/.test(response.content.toLowerCase())) score += 1 // Has reader engagement
                break

            case 'content':
                if (response.content.length >= 800) score += 2
                if ((response.content.match(/#{2,3}/g) || []).length >= 3) score += 2 // Has multiple headings
                if (response.content.includes('Ví dụ:') || response.content.includes('Ví dụ như:')) score += 1
                if (
                    response.content.toLowerCase().includes('kết luận') ||
                    response.content.toLowerCase().includes('tóm lại')
                )
                    score += 1
                break
        }

        return score
    }

    // Helper function to detect which field the content belongs to
    const detectContentField = (content: string, fullResponse: string): 'title' | 'description' | 'content' => {
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
        } // Analyze content characteristics
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

    // Helper function to detect the action type
    const detectAction = (content: string): 'suggest' | 'edit' | 'spellcheck' | 'improve' => {
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
    } // Hệ thống prompt cho từng loại nội dung
    const getFieldSpecificPrompt = (field: ContentField) => {
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
- Tối ưu SEO

Ví dụ format phần áp dụng:
Design Pattern Java: Bí mật code sạch đẹp
Java Design Pattern: Từ cơ bản đến thành thạo  
Làm chủ Design Pattern Java trong 30 ngày`,

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

        return fieldPrompts[field]
    }

    // Handle sending message
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            const currentData = {
                title: formData.title || '',
                description: formData.description || '',
                content: formData.content || '',
                category: formData.category || ''
            }

            const conversationContext =
                messages.length > 0
                    ? messages
                          .slice(-3)
                          .map((msg) => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
                          .join('\n')
                    : ''

            // Handle Quill content for context
            if (isQuillContent(currentData.content)) {
                currentData.content = convertQuillToText(currentData.content)
            }

            const systemPrompt = getFieldSpecificPrompt(selectedField)
            const promptWithContext = `${systemPrompt}

Thông tin blog hiện tại:
- Tiêu đề: ${currentData.title || '(chưa có)'}
- Mô tả: ${currentData.description || '(chưa có)'}
- Nội dung: ${currentData.content || '(chưa có)'}
- Danh mục: ${currentData.category || '(chưa có)'}

${conversationContext ? `Ngữ cảnh cuộc hội thoại:\n${conversationContext}\n` : ''}

Câu hỏi: ${inputValue.trim()}`

            const aiResponse = await geminiService.generateContent(promptWithContext)
            const suggestions = parseAIResponse(aiResponse).filter((s) => s.field === selectedField)
            const formattedContent = formatAIResponseForDisplay(aiResponse)

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: formattedContent,
                timestamp: new Date(),
                suggestions: suggestions.length > 0 ? suggestions : undefined
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error('AI Assistant error:', error)
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: 'Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại.',
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    // Handle key press in input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    } // Handle applying suggestion to form
    const handleApplySuggestion = (suggestion: AIResponse, mode: 'replace' | 'append' = 'replace') => {
        let contentToApply = suggestion.content

        // Đảm bảo mode append chỉ áp dụng cho content
        if (mode === 'append' && suggestion.field !== 'content') {
            mode = 'replace'
        }

        // Xử lý cho trường content
        if (suggestion.field === 'content') {
            // Chuyển đổi nội dung mới sang Quill Delta nếu chưa phải
            if (!isQuillContent(suggestion.content)) {
                contentToApply = JSON.stringify(convertMarkdownToQuill(suggestion.content))
            }
        }

        // Gọi callback để áp dụng nội dung
        onApplyToField(suggestion.field, contentToApply, mode)
    }

    const handleQuickAction = (prompt: string) => {
        setInputValue(prompt)
        // Auto focus input after setting value
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 100)
    }

    // Get placeholder text based on selected field
    const getInputPlaceholder = () => {
        switch (selectedField) {
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

    // Update quick actions based on selected field
    const getQuickActionForField = () => {
        switch (selectedField) {
            case 'title':
                return {
                    icon: <HiPencilSquare />,
                    label: 'Gợi ý tiêu đề',
                    prompt: `Hãy gợi ý 3 tiêu đề hấp dẫn, SEO-friendly cho blog về chủ đề "${formData.category || 'chưa có'}". Mỗi tiêu đề cần:
- Độ dài 40-60 ký tự
- Có từ khóa chính
- Tạo sự tò mò cho người đọc`
                }
            case 'description':
                return {
                    icon: <HiChatBubbleBottomCenterText />,
                    label: 'Viết mô tả',
                    prompt: `Dựa trên tiêu đề "${formData.title || 'chưa có'}", hãy viết mô tả blog:
- Độ dài 120-160 ký tự
- Tóm tắt nội dung chính
- Có call-to-action`
                }
            case 'content':
                return {
                    icon: <HiClipboardDocument />,
                    label: 'Tạo nội dung',
                    prompt: `Viết nội dung blog chi tiết cho tiêu đề "${formData.title || 'chưa có'}" với:
- Cấu trúc heading rõ ràng
- Ví dụ minh họa
- Kết luận tóm tắt`
                }
            default:
                return null
        }
    }

    if (!isOpen) return null

    return (
        <div className={cx('chat-assistant')}>
            {/* Header */}
            <div className={cx('chat-header')}>
                <div className={cx('header-content')}>
                    <HiSparkles className={cx('header-icon')} />
                    <h3>AI Writing Assistant</h3>
                </div>
                <button className={cx('close-btn')} onClick={onToggle}>
                    <HiXMark />
                </button>
            </div>

            {/* Content Field Selector */}
            <ContentFieldSelector selectedField={selectedField} onFieldChange={(field) => setSelectedField(field)} />

            {/* Messages */}
            <div className={cx('chat-messages')}>
                {messages.length === 0 && (
                    <div className={cx('welcome-message')}>
                        <HiSparkles className={cx('welcome-icon')} />
                        <h4>Chào bạn! Tôi là AI Writing Assistant</h4>
                        <p>Tôi có thể giúp bạn:</p>
                        <ul>
                            <li>Gợi ý tiêu đề hấp dẫn</li>
                            <li>Viết mô tả blog SEO-friendly</li>
                            <li>Tạo nội dung chi tiết</li>
                            <li>Cải thiện văn phong</li>
                            <li>Kiểm tra chính tả</li>
                        </ul>
                        <p>Hãy thử các gợi ý nhanh bên dưới hoặc đặt câu hỏi cụ thể!</p>
                    </div>
                )}
                {messages.map((message) => (
                    <div key={message.id} className={cx('message', message.type)}>
                        <div className={cx('message-content')}>
                            {message.type === 'ai' ? (
                                <MarkdownRenderer content={message.content} className={cx('ai-message-text')} />
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>

                        {/* AI Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                            <div className={cx('suggestions')}>
                                <h5>Gợi ý áp dụng:</h5>
                                {message.suggestions.map((suggestion, index) => (
                                    <div key={index} className={cx('suggestion-item')}>
                                        <div className={cx('suggestion-header')}>
                                            <span className={cx('suggestion-field')}>
                                                {suggestion.field === 'title'
                                                    ? 'Tiêu đề'
                                                    : suggestion.field === 'description'
                                                      ? 'Mô tả'
                                                      : 'Nội dung'}
                                            </span>
                                            <span className={cx('suggestion-action')}>
                                                {suggestion.action === 'suggest'
                                                    ? 'Gợi ý'
                                                    : suggestion.action === 'edit'
                                                      ? 'Chỉnh sửa'
                                                      : suggestion.action === 'improve'
                                                        ? 'Cải thiện'
                                                        : 'Kiểm tra'}
                                            </span>
                                        </div>
                                        <div className={cx('suggestion-content')}>
                                            {renderSuggestionContent(suggestion)}
                                        </div>
                                        <div className={cx('suggestion-actions')}>
                                            <button
                                                className={cx('apply-btn', 'replace')}
                                                onClick={() => handleApplySuggestion(suggestion, 'replace')}
                                                title='Thay thế nội dung hiện tại'
                                            >
                                                <HiCheck /> Áp dụng
                                            </button>
                                            {/* Chỉ hiện nút "Thêm vào" cho phần content */}
                                            {suggestion.field === 'content' && (
                                                <button
                                                    className={cx('apply-btn', 'append')}
                                                    onClick={() => handleApplySuggestion(suggestion, 'append')}
                                                    title='Thêm vào nội dung hiện tại'
                                                >
                                                    <HiArrowPath /> Thêm vào
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}{' '}
                {/* Loading indicator */}
                {isLoading && (
                    <div className={cx('message', 'ai', 'loading')}>
                        <div className={cx('message-content')}>
                            <div className={cx('loading-indicator')}>
                                <div className={cx('typing-indicator')}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
                <div className={cx('quick-actions')}>
                    <h5>Gợi ý nhanh:</h5>
                    <div className={cx('action-buttons')}>
                        {getQuickActionForField() && (
                            <button
                                className={cx('quick-action-btn')}
                                onClick={() => handleQuickAction(getQuickActionForField()!.prompt)}
                            >
                                {getQuickActionForField()!.icon}
                                <span>{getQuickActionForField()!.label}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className={cx('chat-input')}>
                <div className={cx('input-container')}>
                    <input
                        ref={inputRef}
                        type='text'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={getInputPlaceholder()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className={cx('send-btn')}
                    >
                        <HiPaperAirplane />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatAIAssistant
