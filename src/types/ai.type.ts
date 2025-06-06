export interface ChatMessage {
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    suggestions?: AIResponse[]
}

export interface AIResponse {
    field: 'title' | 'description' | 'content'
    content: string
    action: 'suggest' | 'edit' | 'spellcheck' | 'improve'
    reasoning: string
}

export type AIAction = 'suggest' | 'edit' | 'spellcheck' | 'improve'
