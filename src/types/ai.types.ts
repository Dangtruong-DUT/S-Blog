export type ContentField = 'title' | 'description' | 'content'

export interface ChatMessage {
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    suggestions?: AIResponse[]
}

export interface AIResponse {
    field: ContentField
    content: string
    action: AIAction
    reasoning?: string
}

export type AIAction = 'suggest' | 'edit' | 'spellcheck' | 'improve'

export interface QuickActionInfo {
    label: string
    prompt: string
    icon?: React.ReactNode
    field?: ContentField
    action?: AIAction
}

export interface AIAssistantFormData {
    title?: string
    description?: string
    content?: string
    category?: string
}

export interface AIAssistantProps {
    isOpen: boolean
    onToggle: () => void
    formData: AIAssistantFormData
    onApplyToField: (field: ContentField, value: string, mode?: 'replace' | 'append') => void
}
