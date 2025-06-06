import { AIResponse } from '../types/ai.type'
import { detectAction, detectContentField, validateContentForField } from './ai.util'

export const formatAIResponseForDisplay = (content: string): string => {
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
            displayContent = content.slice(0, match.index).trim()
            break
        }
    }

    return displayContent
}

export const parseAIResponse = (content: string): AIResponse[] => {
    const responses: AIResponse[] = []
    const separatorPatterns = [
        /---+\s*(?:NỘI DUNG ÁP DỤNG|ÁP DỤNG|CONTENT)\s*---+/i,
        /(?:NỘI DUNG ÁP DỤNG|ÁP DỤNG|CONTENT)\s*:/i
    ]

    let applicableContent = ''
    let foundSeparator = false

    for (const pattern of separatorPatterns) {
        const match = content.match(pattern)
        if (match) {
            applicableContent = content.slice(match.index! + match[0].length).trim()
            foundSeparator = true
            break
        }
    }

    if (foundSeparator && applicableContent.length > 10) {
        const field = detectContentField(applicableContent, content)
        const action = detectAction(content)

        if (field === 'title' || field === 'description') {
            const lines = applicableContent
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0)

            const suggestions = lines.filter((line) => {
                const metadataPatterns = [
                    /^(?:---|===)/,
                    /^[#*•-]\s/,
                    /^(?:gợi ý|áp dụng|nội dung|phân tích|tiêu đề|mô tả|ví dụ|lưu ý|chú ý|suggestion|note):/i,
                    /^(?:gợi ý|áp dụng|nội dung|phân tích|tiêu đề|mô tả)\s+(?:về|cho|của)/i
                ]

                if (line.length < 15 || metadataPatterns.some((pattern) => pattern.test(line.toLowerCase()))) {
                    return false
                }

                if (field === 'title') {
                    return line.length >= 20 && line.length <= 100
                } else if (field === 'description') {
                    return line.length >= 50 && line.length <= 300
                }

                return true
            })

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

            if (responses.length === 0 && validateContentForField(applicableContent, field)) {
                responses.push({
                    field,
                    content: applicableContent,
                    action,
                    reasoning: `AI suggestion for ${field}`
                })
            }
        } else {
            if (validateContentForField(applicableContent, field)) {
                responses.push({
                    field,
                    content: applicableContent,
                    action,
                    reasoning: `AI suggestion for ${field}`
                })
            }
        }
    }

    // Return responses after filtering duplicates
    return responses.filter(
        (response, index, self) =>
            index === self.findIndex((r) => r.field === response.field && r.content === response.content)
    )
}
