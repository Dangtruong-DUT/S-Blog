import { useState } from 'react'
import { geminiService } from '../apis/gemini.api'
import { ContentField, ChatMessage, AIResponse, QuickActionInfo } from '../types/ai.types'
import { getFieldPrompt, getInputPlaceholder, getQuickAction } from '../utils/ai.util'
import { isQuillDelta, convertDeltaToText } from '../utils/quillUtils'
import { convertMarkdownToQuill } from '../utils/convertMarkdownToQuill'
import { formatAIResponseForDisplay, parseAIResponse } from '../utils/aiResponseParser'
import { renderSuggestionContent } from '../components/AIResponseRenderer/AIResponseRenderer'

interface UseAIAssistantReturn {
    messages: ChatMessage[]
    inputValue: string
    isLoading: boolean
    setInputValue: (value: string) => void
    handleSendMessage: () => Promise<void>
    handleApplySuggestion: (suggestion: AIResponse, mode?: 'replace' | 'append') => void
    handleQuickAction: (prompt: string) => void
    renderSuggestionContent: (suggestion: AIResponse) => React.JSX.Element
    getInputPlaceholder: () => string
    getQuickActionForField: () => QuickActionInfo | null
}

export const useAIAssistant = (
    formData: {
        title?: string
        description?: string
        content?: string
        category?: string
    },
    selectedField: ContentField,
    onApplyToField: (field: ContentField, value: string, mode?: 'replace' | 'append') => void
): UseAIAssistantReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

            // Get last 3 messages for context
            const conversationContext =
                messages.length > 0
                    ? messages
                          .slice(-3)
                          .map((msg) => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
                          .join('\n')
                    : ''

            // Convert Quill content to text if needed
            if (isQuillDelta(currentData.content)) {
                currentData.content = convertDeltaToText(currentData.content)
            }

            // Build the prompt
            const systemPrompt = getFieldPrompt(selectedField)
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

    const handleApplySuggestion = (suggestion: AIResponse, mode: 'replace' | 'append' = 'replace') => {
        let contentToApply = suggestion.content

        if (mode === 'append' && suggestion.field !== 'content') {
            mode = 'replace'
        }

        if (suggestion.field === 'content' && !isQuillDelta(suggestion.content)) {
            contentToApply = JSON.stringify(convertMarkdownToQuill(suggestion.content))
        }

        onApplyToField(suggestion.field, contentToApply, mode)
    }

    const handleQuickAction = (prompt: string) => {
        setInputValue(prompt)
    }

    return {
        messages,
        inputValue,
        isLoading,
        setInputValue,
        handleSendMessage,
        handleApplySuggestion,
        handleQuickAction,
        renderSuggestionContent,
        getInputPlaceholder: () => getInputPlaceholder(selectedField),
        getQuickActionForField: () => {
            const prompt = getQuickAction(selectedField, formData.category, formData.title)
            if (!prompt) return null
            return {
                label:
                    selectedField === 'title'
                        ? 'Gợi ý tiêu đề'
                        : selectedField === 'description'
                          ? 'Viết mô tả'
                          : 'Tạo nội dung',
                prompt
            }
        }
    }
}
