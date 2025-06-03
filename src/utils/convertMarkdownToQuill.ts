// Quill Delta Types
export type QuillHeaderLevel = 1 | 2 | 3 | 4 | 5 | 6
export type QuillListType = 'ordered' | 'bullet'
export type QuillScriptType = 'sub' | 'super'
export type QuillSizeType = 'small' | 'large' | 'huge'
export type QuillAlignType = 'left' | 'center' | 'right' | 'justify'

export interface QuillAttributes {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strike?: boolean
    code?: boolean
    script?: QuillScriptType
    link?: string
    color?: string
    background?: string
    size?: QuillSizeType
    font?: string
    header?: QuillHeaderLevel
    indent?: number
    list?: QuillListType
    align?: QuillAlignType
    direction?: 'rtl'
    code_block?: boolean
    blockquote?: boolean
    [key: string]: unknown
}

export interface QuillInsertContent {
    image?: string
    video?: string
    formula?: string
    [key: string]: unknown
}

export interface QuillOp {
    insert: string | QuillInsertContent
    attributes?: QuillAttributes
}

export interface QuillDelta {
    ops: QuillOp[]
}

// Helpers
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function validateQuillInsertContent(content: unknown): content is QuillInsertContent {
    if (!isRecord(content)) return false
    return (
        ('image' in content && typeof content.image === 'string') ||
        ('video' in content && typeof content.video === 'string') ||
        ('formula' in content && typeof content.formula === 'string')
    )
}

function validateQuillOp(op: unknown): op is QuillOp {
    if (!isRecord(op)) return false

    if (!('insert' in op)) return false
    const { insert, attributes } = op

    if (typeof insert === 'string') {
        return attributes === undefined || isValidQuillAttributes(attributes)
    }

    if (isRecord(insert) && validateQuillInsertContent(insert as Record<string, unknown>)) {
        return attributes === undefined || isValidQuillAttributes(attributes)
    }

    return false
}

function isValidQuillAttributes(attributes: unknown): attributes is QuillAttributes {
    if (!isRecord(attributes)) return false

    const validBooleanProps = ['bold', 'italic', 'underline', 'strike', 'code', 'code_block', 'blockquote']
    const validStringProps = ['link', 'color', 'background', 'font']

    for (const [key, value] of Object.entries(attributes)) {
        if (validBooleanProps.includes(key) && typeof value !== 'boolean') return false
        if (validStringProps.includes(key) && typeof value !== 'string') return false
        if (key === 'script' && !['sub', 'super'].includes(value as string)) return false
        if (key === 'size' && !['small', 'large', 'huge'].includes(value as string)) return false
        if (key === 'header' && ![1, 2, 3, 4, 5, 6].includes(value as number)) return false
        if (key === 'indent' && typeof value !== 'number') return false
        if (key === 'list' && !['ordered', 'bullet'].includes(value as string)) return false
        if (key === 'align' && !['left', 'center', 'right', 'justify'].includes(value as string)) return false
        if (key === 'direction' && value !== 'rtl') return false
    }

    return true
}

// Parse JSON and handle nested cases
function deepParseJSON(input: string): unknown {
    try {
        const parsed = JSON.parse(input)
        if (typeof parsed === 'string') {
            // Nếu kết quả parse vẫn là string, thử parse tiếp
            try {
                return JSON.parse(parsed)
            } catch {
                // Nếu không parse được nữa, trả về string đó
                return parsed
            }
        }
        return parsed
    } catch {
        return input
    }
}

export function validateAndSanitizeQuillDelta(input: unknown): QuillDelta {
    try {
        // Handle null, undefined, or empty input
        if (input === null || input === undefined || input === '') {
            return { ops: [{ insert: '' }] }
        }

        // Handle string input (possibly JSON)
        if (typeof input === 'string') {
            // Normalize line endings
            const normalizedInput = input.replace(/\\n/g, '\n')

            // Handle nested JSON strings
            const parsed = deepParseJSON(normalizedInput)

            // If parsed result is still a string and looks like it contains ops
            if (typeof parsed === 'string' && parsed.includes('"ops":[')) {
                try {
                    return JSON.parse(parsed) as QuillDelta
                } catch {
                    return { ops: [{ insert: parsed + '\n' }] }
                }
            }

            return validateAndSanitizeQuillDelta(parsed)
        }

        // If input is already a Quill Delta object
        if (isRecord(input) && Array.isArray(input.ops)) {
            const validOps = input.ops
                .filter((op): op is QuillOp => validateQuillOp(op))
                .filter(
                    (op) =>
                        (typeof op.insert === 'string' && op.insert.length > 0) ||
                        (typeof op.insert === 'object' && Object.keys(op.insert).length > 0)
                )

            if (validOps.length > 0) {
                return { ops: validOps }
            }
        }

        // If input is a single operation
        if (isRecord(input) && 'insert' in input && validateQuillOp(input)) {
            return { ops: [input] }
        }

        // Fallback to treating it as plain string
        return { ops: [{ insert: String(input) }] }
    } catch (error) {
        console.error('Failed to validate Quill Delta:', error)
        return { ops: [{ insert: '' }] }
    }
}

export function convertMarkdownToQuill(markdown: string): QuillDelta {
    try {
        const ops: QuillOp[] = []
        const lines = markdown.split('\n')

        for (const line of lines) {
            const h1Match = line.match(/^# (.+)$/)
            const h2Match = line.match(/^## (.+)$/)
            const h3Match = line.match(/^### (.+)$/)

            if (h1Match) {
                ops.push({ insert: h1Match[1] }, { attributes: { header: 1 }, insert: '\n' }, { insert: '\n' })
                continue
            }
            if (h2Match) {
                ops.push({ insert: h2Match[1] }, { attributes: { header: 2 }, insert: '\n' }, { insert: '\n' })
                continue
            }
            if (h3Match) {
                ops.push({ insert: h3Match[1] }, { attributes: { header: 3 }, insert: '\n' }, { insert: '\n' })
                continue
            }

            const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/)
            if (imageMatch) {
                ops.push(
                    { attributes: { align: 'center' }, insert: '\n' },
                    { insert: { image: imageMatch[2] } },
                    { attributes: { align: 'center' }, insert: '\n' }
                )
                continue
            }

            if (line || lines.length > 1) {
                if (line) ops.push({ insert: line })
                ops.push({ insert: '\n' })
            }
        }

        if (ops.length === 0) {
            ops.push({ insert: '\n' })
        }

        return validateAndSanitizeQuillDelta({ ops })
    } catch (error) {
        console.error('Failed to convert markdown to Quill Delta:', error)
        return { ops: [{ insert: markdown }] }
    }
}

function parseQuillContent(content: string): QuillDelta {
    try {
        // Normalize line endings
        const normalizedContent = content.replace(/\\n/g, '\n')

        // Parse and handle nested JSON
        const parsed = deepParseJSON(normalizedContent)

        if (isRecord(parsed) && Array.isArray(parsed.ops)) {
            const validOps = parsed.ops
                .filter((op): op is QuillOp => validateQuillOp(op))
                .map((op) => {
                    // Ensure string content ends with newline
                    if (typeof op.insert === 'string') {
                        return {
                            ...op,
                            insert: op.insert.endsWith('\n') ? op.insert : op.insert + '\n'
                        }
                    }
                    return op
                })
                .filter(
                    (op) =>
                        (typeof op.insert === 'string' && op.insert.length > 0) ||
                        (typeof op.insert === 'object' && Object.keys(op.insert).length > 0)
                )

            if (validOps.length > 0) {
                return { ops: validOps }
            }
        }

        // If parsing fails, try to fix common issues with nested JSON
        if (typeof parsed === 'string' && parsed.includes('"ops":[')) {
            try {
                return JSON.parse(parsed) as QuillDelta
            } catch {
                return { ops: [{ insert: parsed + '\n' }] }
            }
        }

        throw new Error('Invalid Quill Delta format')
    } catch {
        return { ops: [{ insert: content + '\n' }] }
    }
}

export function convertQuillToText(content: string): string {
    try {
        const delta = parseQuillContent(content)
        return delta.ops
            .map((op) => {
                if (typeof op.insert === 'string') {
                    return op.insert
                }
                if (isRecord(op.insert)) {
                    if ('image' in op.insert) return '[Image]'
                    if ('video' in op.insert) return '[Video]'
                    if ('formula' in op.insert) return '[Formula]'
                }
                return ''
            })
            .join('')
    } catch (error) {
        console.error('Error converting Quill to text:', error)
        return content
    }
}

export function convertQuillToPreview(content: string, maxLength: number = 200): string {
    try {
        const text = convertQuillToText(content)
        if (text.length <= maxLength) return text

        let preview = text.substring(0, maxLength)
        const lastSpace = preview.lastIndexOf(' ')
        if (lastSpace > maxLength * 0.8) {
            preview = preview.substring(0, lastSpace)
        }
        return preview.trim() + '...'
    } catch (error) {
        console.error('Error creating Quill preview:', error)
        return content.substring(0, maxLength) + '...'
    }
}
