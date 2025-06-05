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
        // Remove outer markdown wrapper if present
        let processedMarkdown = markdown
        const lines = processedMarkdown.split('\n')
        if (lines.length > 2) {
            const firstLine = lines[0].trim()
            const lastLine = lines[lines.length - 1].trim()
            if (firstLine === '```markdown' && lastLine === '```') {
                processedMarkdown = lines.slice(1, -1).join('\n')
            }
        }

        const ops: QuillOp[] = []
        const contentLines = processedMarkdown.split('\n')
        let inCodeBlock = false
        let codeBlockContent = ''
        let codeBlockLanguage = ''

        // Set of supported programming languages
        const programmingLanguages = new Set([
            'javascript',
            'typescript',
            'python',
            'java',
            'c',
            'cpp',
            'csharp',
            'ruby',
            'php',
            'swift',
            'kotlin',
            'rust',
            'go',
            'scala',
            'r',
            'html',
            'css',
            'sql',
            'shell',
            'bash',
            'powershell',
            'dockerfile',
            'json',
            'yaml',
            'markdown',
            'xml'
        ])

        const processCodeBlock = (content: string, language?: string) => {
            if (!content.trim()) return

            // Xử lý nội dung code block
            let formattedContent = content
                .replace(/^```[\w]*\s*\n?/, '') // Loại bỏ khai báo ngôn ngữ ở đầu
                .replace(/```\s*$/, '') // Loại bỏ dấu đóng code block

            // Chuẩn hóa khoảng trắng và indentation
            const lines = formattedContent.split('\n')

            // Tìm mức indent chung nhỏ nhất cho các dòng không trống
            const nonEmptyLines = lines.filter((line) => line.trim())
            const minIndent =
                nonEmptyLines.length > 0
                    ? Math.min(
                          ...nonEmptyLines.map((line) => {
                              const match = line.match(/^\s*/)
                              return match ? match[0].length : 0
                          })
                      )
                    : 0

            // Xử lý từng dòng
            formattedContent = lines
                .map((line) => {
                    // Giữ lại dòng trống
                    if (!line.trim()) return ''

                    // Loại bỏ khoảng trắng chung nhưng giữ indentation tương đối
                    const match = line.match(/^\s*/)
                    const currentIndent = match ? match[0].length : 0
                    return line.slice(Math.min(currentIndent, minIndent))
                })
                .join('\n')
                .trim()

            // Thêm vào ops với định dạng code block
            if (language && programmingLanguages.has(language.toLowerCase())) {
                ops.push({
                    insert: formattedContent + '\n',
                    attributes: {
                        'code-block': true,
                        'code-lang': language.toLowerCase()
                    }
                })
            } else {
                ops.push({
                    insert: formattedContent + '\n',
                    attributes: {
                        'code-block': true
                    }
                })
            }
        }

        const processHeader = (content: string, level: QuillHeaderLevel) => {
            parseInlineFormatting(content.trim(), ops)
            ops.push({ insert: '\n', attributes: { header: level } })
        }

        for (let i = 0; i < contentLines.length; i++) {
            const line = contentLines[i]

            // Handle code blocks
            const codeBlockStart = line.match(/^```(\w+)?/)
            if (codeBlockStart) {
                if (!inCodeBlock) {
                    inCodeBlock = true
                    codeBlockLanguage = codeBlockStart[1] || ''
                    codeBlockContent = ''
                } else {
                    inCodeBlock = false
                    processCodeBlock(codeBlockContent, codeBlockLanguage)
                    codeBlockContent = ''
                    codeBlockLanguage = ''
                }
                continue
            }

            if (inCodeBlock) {
                // Thêm dòng mới khi nối các dòng code, nhưng không thêm cho dòng đầu tiên
                if (codeBlockContent) {
                    codeBlockContent += '\n' + line
                } else {
                    codeBlockContent = line
                }
                continue
            }

            // Handle headers
            const headerMatch = line.match(/^(#{1,6})\s+(.+)$/)
            if (headerMatch) {
                const level = headerMatch[1].length as QuillHeaderLevel
                const content = headerMatch[2]
                processHeader(content, level)
                continue
            }

            // Handle blockquotes với inline formatting
            const blockquoteMatch = line.match(/^> (.+)$/)
            if (blockquoteMatch) {
                parseInlineFormatting(blockquoteMatch[1], ops)
                ops.push({ attributes: { blockquote: true }, insert: '\n' })
                continue
            }

            // Handle lists với inline formatting
            const orderedListMatch = line.match(/^\d+\.\s+(.+)$/)
            const unorderedListMatch = line.match(/^[-*+]\s+(.+)$/)

            if (orderedListMatch) {
                parseInlineFormatting(orderedListMatch[1], ops)
                ops.push({ attributes: { list: 'ordered' }, insert: '\n' })
                continue
            }
            if (unorderedListMatch) {
                parseInlineFormatting(unorderedListMatch[1], ops)
                ops.push({ attributes: { list: 'bullet' }, insert: '\n' })
                continue
            }

            // Handle images
            const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/)
            if (imageMatch) {
                ops.push({ insert: { image: imageMatch[2] } }, { insert: '\n' })
                continue
            }

            // Handle horizontal rules
            if (line.match(/^---+$/) || line.match(/^\*\*\*+$/) || line.match(/^___+$/)) {
                ops.push({ insert: '─'.repeat(50) }, { insert: '\n' })
                continue
            }

            // Handle empty lines
            if (!line.trim()) {
                ops.push({ insert: '\n' })
                continue
            }

            // Handle regular paragraphs with inline formatting
            parseInlineFormatting(line, ops)
            ops.push({ insert: '\n' })
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

// Helper function to parse inline formatting (bold, italic, code, links)
function parseInlineFormatting(text: string, ops: QuillOp[]): void {
    // Khởi tạo
    let processed = false

    // Patterns với thứ tự ưu tiên (từ phức tạp đến đơn giản)
    const patterns = [
        // Code blocks inline - ưu tiên cao nhất
        { regex: /`([^`]+)`/g, attrs: { code: true }, priority: 1 },
        // Links - ưu tiên cao
        { regex: /\[([^\]]+)\]\(([^)]+)\)/g, isLink: true, priority: 2 },
        // Bold + Italic combined
        { regex: /\*\*\*([^*]+)\*\*\*/g, attrs: { bold: true, italic: true }, priority: 3 },
        { regex: /___([^_]+)___/g, attrs: { bold: true, italic: true }, priority: 3 },
        // Bold with colon (như "**Bootstrap:**") - special handling
        { regex: /\*\*([^*]+):\*\*/g, attrs: { bold: true }, priority: 4, addColon: true },
        // Bold only
        { regex: /\*\*([^*]+)\*\*/g, attrs: { bold: true }, priority: 4 },
        { regex: /__([^_]+)__/g, attrs: { bold: true }, priority: 4 },
        // Strikethrough
        { regex: /~~([^~]+)~~/g, attrs: { strike: true }, priority: 5 },
        // Underline (không phổ biến trong Markdown nhưng hữu ích)
        { regex: /<u>([^<]+)<\/u>/g, attrs: { underline: true }, priority: 5 },
        // Italic - ưu tiên thấp nhất để tránh conflict với bold
        { regex: /\*([^*\s][^*]*[^*\s])\*/g, attrs: { italic: true }, priority: 6 },
        { regex: /_([^_\s][^_]*[^_\s])_/g, attrs: { italic: true }, priority: 6 }
    ] // Tìm tất cả matches với position
    const allMatches: Array<{
        start: number
        end: number
        text: string
        attrs?: QuillAttributes
        priority: number
        original: string
        addColon?: boolean
    }> = []

    for (const pattern of patterns) {
        let match
        pattern.regex.lastIndex = 0

        while ((match = pattern.regex.exec(text)) !== null) {
            if (pattern.isLink) {
                allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[1], // Link text
                    attrs: { link: match[2] }, // Link URL
                    priority: pattern.priority,
                    original: match[0]
                })
            } else {
                allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[1], // Captured content
                    attrs: pattern.attrs,
                    priority: pattern.priority,
                    original: match[0],
                    addColon: pattern.addColon || false
                })
            }
        }
    }

    // Sắp xếp theo vị trí, sau đó theo priority
    allMatches.sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start
        return a.priority - b.priority // Priority thấp hơn = ưu tiên cao hơn
    })

    // Loại bỏ overlapping matches - chọn match có priority cao hơn
    const validMatches: typeof allMatches = []
    for (const current of allMatches) {
        let isValid = true

        // Kiểm tra overlap với các match đã chọn
        for (const existing of validMatches) {
            // Kiểm tra overlap
            if (current.start < existing.end && current.end > existing.start) {
                // Có overlap - chọn match có priority cao hơn (số nhỏ hơn)
                if (current.priority >= existing.priority) {
                    isValid = false
                    break
                } else {
                    // Current có priority cao hơn, remove existing
                    const existingIndex = validMatches.indexOf(existing)
                    validMatches.splice(existingIndex, 1)
                }
            }
        }

        if (isValid) {
            validMatches.push(current)
        }
    }

    // Sắp xếp lại theo vị trí
    validMatches.sort((a, b) => a.start - b.start)

    // Tạo ops từ matches
    let currentIndex = 0
    for (const match of validMatches) {
        // Thêm text thuần trước match
        if (match.start > currentIndex) {
            const plainText = text.slice(currentIndex, match.start)
            if (plainText) {
                ops.push({ insert: plainText })
                processed = true
            }
        } // Thêm formatted text
        if (match.attrs) {
            if (match.addColon) {
                // Xử lý trường hợp đặc biệt như "**Bootstrap:**"
                ops.push({ insert: match.text + ':', attributes: match.attrs })
            } else {
                ops.push({ insert: match.text, attributes: match.attrs })
            }
            processed = true
        }

        currentIndex = match.end
    }

    // Thêm text còn lại
    if (currentIndex < text.length) {
        const remainingTextPart = text.slice(currentIndex)
        if (remainingTextPart) {
            ops.push({ insert: remainingTextPart })
            processed = true
        }
    }

    // Nếu không có formatting nào được xử lý, thêm text gốc
    if (!processed && text) {
        ops.push({ insert: text })
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

export function mergeQuillDeltas(delta1: string, delta2: string): string {
    try {
        // Parse delta strings into objects
        const firstDelta = JSON.parse(delta1)
        const secondDelta = JSON.parse(delta2)

        // Kiểm tra xem có phải Quill Delta hợp lệ không
        if (!firstDelta.ops || !secondDelta.ops) {
            throw new Error('Invalid Quill Delta format')
        }

        // Đảm bảo có dòng trống giữa hai nội dung
        if (firstDelta.ops.length > 0) {
            const lastOp = firstDelta.ops[firstDelta.ops.length - 1]
            if (typeof lastOp.insert === 'string' && !lastOp.insert.endsWith('\n\n')) {
                // Thêm dòng trống nếu cần
                const newlinesNeeded = lastOp.insert.endsWith('\n') ? 1 : 2
                firstDelta.ops.push({ insert: '\n'.repeat(newlinesNeeded) })
            }
        }

        // Kết hợp hai delta
        const mergedDelta = {
            ops: [...firstDelta.ops, ...secondDelta.ops]
        }

        return JSON.stringify(mergedDelta)
    } catch (error) {
        console.error('Error merging Quill Deltas:', error)
        // Trả về delta thứ hai nếu có lỗi
        return delta2
    }
}
