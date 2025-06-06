import classNames from 'classnames/bind'
import styles from './AIResponseRenderer.module.scss'
import { AIResponse } from 'src/types/ai.types'
import MarkdownRenderer from '../MarkdownRenderer'
import { convertDeltaToPreview, isQuillDelta } from 'src/utils/quillUtils'

const cx = classNames.bind(styles)

export const renderSuggestionContent = (suggestion: AIResponse): React.JSX.Element => {
    // Special rendering for content field suggestions
    if (suggestion.field === 'content') {
        if (isQuillDelta(suggestion.content)) {
            const preview = convertDeltaToPreview(suggestion.content, 200)
            return <p className={cx('quill-preview')}>{preview}</p>
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
