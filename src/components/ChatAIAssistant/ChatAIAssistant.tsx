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
        // Remove any content within brackets for display
        const displayContent = content.replace(/\[([^\]]+)\]/g, (_, innerContent) => {
            // Check if this looks like a suggestion we want to keep visible
            if (innerContent.length < 100 && !innerContent.includes('\n')) {
                return innerContent
            }
            return innerContent
        })

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
    }

    // Enhanced AI response parsing with multiple strategies
    const parseAIResponse = (content: string): AIResponse[] => {
        const responses: AIResponse[] = []

        // Strategy 1: Extract content in brackets [content]
        const bracketMatches = content.match(/\[([^\]]+)\]/g)
        if (bracketMatches) {
            bracketMatches.forEach((match: string) => {
                const extractedContent = match.slice(1, -1).trim()
                // Chỉ xử lý nội dung có ý nghĩa
                if (extractedContent.length > 10) {
                    const field = detectContentField(extractedContent, content)
                    const action = detectAction(content)

                    // Kiểm tra xem nội dung có phù hợp với field không
                    const isValidContent = validateContentForField(extractedContent, field)
                    if (isValidContent) {
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

        // Strategy 2: Extract field-specific content with labels
        const fieldPatterns = [
            { pattern: /(?:tiêu đề|title):\s*(.+?)(?:\n|$)/gi, field: 'title' as const },
            { pattern: /(?:mô tả|description):\s*(.+?)(?:\n|$)/gi, field: 'description' as const }
        ]

        fieldPatterns.forEach(({ pattern, field }) => {
            let match
            while ((match = pattern.exec(content)) !== null) {
                const extractedContent = match[1].trim()
                if (extractedContent.length > 5) {
                    const action = detectAction(content)
                    responses.push({
                        field,
                        content: extractedContent,
                        action,
                        reasoning: `AI suggestion for ${field}`
                    })
                }
            }
        })

        // Strategy 3: Extract long-form content with markdown headers for content field
        const contentPatterns = [
            /(?:nội dung|content):\s*([\s\S]+?)(?:\n\n|$)/gi,
            /(?:bài viết|article):\s*([\s\S]+?)(?:\n\n|$)/gi
        ]

        contentPatterns.forEach((pattern) => {
            let match
            while ((match = pattern.exec(content)) !== null) {
                const extractedContent = match[1].trim()
                if (extractedContent.length > 50) {
                    const action = detectAction(content)
                    responses.push({
                        field: 'content',
                        content: extractedContent,
                        action,
                        reasoning: 'AI suggestion for content'
                    })
                }
            }
        })

        // Strategy 4: Fallback - if no specific patterns found, try to detect content type
        if (responses.length === 0) {
            const isContentResponse =
                content.toLowerCase().includes('nội dung') ||
                content.toLowerCase().includes('content') ||
                content.toLowerCase().includes('bài viết') ||
                content.includes('##') ||
                content.includes('###') ||
                content.length > 300

            if (isContentResponse) {
                let cleanContent = content
                // Remove common AI prefixes
                cleanContent = cleanContent.replace(/^(đây là|here is|nội dung|content)[:\s]*/i, '')

                responses.push({
                    field: 'content',
                    content: cleanContent.trim(),
                    action: detectAction(content),
                    reasoning: 'AI generated content'
                })
            }
        }

        // Remove duplicates and sort by priority
        const uniqueResponses = responses.filter(
            (response, index, self) =>
                index === self.findIndex((r) => r.field === response.field && r.content === response.content)
        )

        // Sort by field priority and quality score
        return uniqueResponses.sort((a, b) => {
            const priorityOrder = { content: 3, title: 2, description: 1 }
            const priorityDiff = priorityOrder[b.field] - priorityOrder[a.field]
            if (priorityDiff !== 0) return priorityDiff
            return getContentQualityScore(b) - getContentQualityScore(a)
        })
    }

    // Validate content for specific field
    const validateContentForField = (content: string, field: 'title' | 'description' | 'content'): boolean => {
        switch (field) {
            case 'title':
                return content.length >= 30 && content.length <= 70
            case 'description':
                return content.length >= 100 && content.length <= 180
            case 'content':
                return content.length >= 200 && (content.includes('#') || content.includes('\n'))
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
    }

    // Hệ thống prompt cho từng loại nội dung
    const getFieldSpecificPrompt = (field: ContentField) => {
        const basePrompt = `Bạn là một AI assistant chuyên hỗ trợ viết blog. Hãy luôn trả lời bằng tiếng Việt và đưa ra các gợi ý cụ thể.

QUAN TRỌNG: 
1. Khi đưa ra nội dung cần áp dụng, hãy luôn đặt trong dấu ngoặc vuông [nội dung] để dễ nhận diện
2. Phân tích yêu cầu của người dùng trước khi đưa ra gợi ý
3. Nếu người dùng chưa cung cấp đủ thông tin, hãy đặt câu hỏi để làm rõ
4. Tất cả các gợi ý phải theo đúng format của trường dữ liệu`

        const fieldPrompts = {
            title: `${basePrompt}

Bạn đang hỗ trợ viết TIÊU ĐỀ blog. Mọi gợi ý phải:
- Độ dài 40-60 ký tự
- Có từ khóa chính theo chủ đề
- Tạo sự tò mò cho người đọc
- Tối ưu SEO
- Phù hợp xu hướng tìm kiếm

Format phản hồi:
1. Phân tích yêu cầu ngắn gọn
2. Đưa ra 3-5 gợi ý tiêu đề trong dấu [], mỗi tiêu đề một dòng
3. Giải thích ngắn gọn về mỗi gợi ý`,

            description: `${basePrompt}

Bạn đang hỗ trợ viết MÔ TẢ blog. Mọi gợi ý phải:
- Độ dài 120-160 ký tự
- Tóm tắt được điểm chính của bài viết
- Có call-to-action thu hút
- Chứa từ khóa chính tự nhiên
- Tối ưu cho SEO

Format phản hồi:
1. Phân tích yêu cầu ngắn gọn
2. Đưa ra 2-3 gợi ý mô tả trong dấu []
3. Giải thích điểm mạnh của mỗi gợi ý`,

            content: `${basePrompt}

Bạn đang hỗ trợ viết NỘI DUNG blog. Mọi gợi ý phải:
- Có cấu trúc rõ ràng với heading H2, H3
- Độ dài tối thiểu 800 từ
- Đầy đủ phần mở đầu, thân bài, kết luận
- Có ví dụ minh họa cụ thể
- Có call-to-action ở cuối bài

Format phản hồi:
1. Phân tích yêu cầu và đề xuất cấu trúc
2. Nếu người dùng đồng ý, đặt toàn bộ nội dung chi tiết trong dấu []
3. Nội dung phải định dạng Markdown chuẩn
4. Có thể chia thành nhiều phần nếu nội dung dài`
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

        // Nếu là trường content, chuyển đổi sang định dạng Quill Delta string
        if (suggestion.field === 'content' && !isQuillContent(suggestion.content)) {
            contentToApply = JSON.stringify(convertMarkdownToQuill(suggestion.content))
        }

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
                                            <button
                                                className={cx('apply-btn', 'append')}
                                                onClick={() => handleApplySuggestion(suggestion, 'append')}
                                                title='Thêm vào nội dung hiện tại'
                                            >
                                                <HiArrowPath /> Thêm vào
                                            </button>
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
                                <span>Đang xử lý...</span>
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
