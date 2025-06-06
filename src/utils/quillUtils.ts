interface QuillDelta {
    ops: Array<{
        insert: string
        attributes?: Record<string, unknown>
    }>
}

export const isQuillDelta = (content: string): boolean => {
    try {
        const parsed = JSON.parse(content)
        return parsed && parsed.ops && Array.isArray(parsed.ops)
    } catch {
        return false
    }
}

export const convertDeltaToPreview = (delta: string, maxLength: number = 200): string => {
    try {
        const parsed: QuillDelta = JSON.parse(delta)
        const text = parsed.ops
            .map((op) => op.insert)
            .join('')
            .trim()

        if (text.length <= maxLength) return text
        return text.slice(0, maxLength - 3) + '...'
    } catch {
        return delta
    }
}

export const convertDeltaToText = (delta: string): string => {
    try {
        const parsed: QuillDelta = JSON.parse(delta)
        return parsed.ops
            .map((op) => op.insert)
            .join('')
            .trim()
    } catch {
        return delta
    }
}
