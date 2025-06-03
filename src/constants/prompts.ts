export const CONTENT_PROMPTS = {
    title: {
        label: 'Title Suggestions',
        prompt: 'Generate a clear, engaging title that accurately reflects the main topic and captures reader interest. Consider SEO optimization and keep it under 60 characters.'
    },
    description: {
        label: 'Description Suggestions',
        prompt: 'Create a concise description that summarizes the main points and value proposition of the content. Keep it between 150-160 characters for optimal SEO.'
    },
    content: {
        label: 'Content Enhancement',
        prompt: 'Analyze and enhance the content while maintaining its core message. Focus on clarity, engagement, and proper structure. Add relevant examples or supporting points where needed.'
    }
}

export type ContentField = 'title' | 'description' | 'content'

export const FIELD_CONFIGS = {
    title: {
        placeholder: 'What would you like to improve about the title?',
        maxLength: 60
    },
    description: {
        placeholder: 'How can I help enhance the description?',
        maxLength: 160
    },
    content: {
        placeholder: 'What aspects of the content would you like to improve?',
        maxLength: undefined
    }
}
