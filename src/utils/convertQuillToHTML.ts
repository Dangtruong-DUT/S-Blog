import hljs from 'highlight.js'
import { DeltaOperation, DeltaStatic } from 'quill'
import { BlockGroup, QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

export const convertToHtml = (delta: DeltaStatic) => {
    try {
        const deltaOps = delta.ops
        const converter = new QuillDeltaToHtmlConverter(deltaOps as DeltaOperation[])
        converter.beforeRender((group, dataGroup) => {
            if (dataGroup instanceof BlockGroup && dataGroup.op.isCodeBlock()) {
                const codeContent = dataGroup.ops.map((value) => value.insert.value).join('')
                const highlighted = hljs.highlightAuto(codeContent)
                const language = highlighted.language || 'plaintext'
                return `<pre><code class="hljs language-${language}">${highlighted.value}</code></pre>`
            } else if (dataGroup instanceof BlockGroup && dataGroup.op.isBlockquote()) {
                const quoteContent = dataGroup.ops.map((value) => value.insert.value).join('')
                return `<blockquote class="block-quote">${quoteContent}</blockquote>`
            }
            return ''
        })
        return converter.convert()
    } catch (error) {
        console.error('Lỗi chuyển đổi HTML:', error)
        return '<p>Lỗi hiển thị nội dung</p>'
    }
}
