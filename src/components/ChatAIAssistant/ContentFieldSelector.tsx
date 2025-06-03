import { CONTENT_PROMPTS, ContentField } from 'src/constants/prompts'
import classNames from 'classnames/bind'
import styles from './ChatAIAssistant.module.scss'

const cx = classNames.bind(styles)

interface ContentFieldSelectorProps {
    selectedField: ContentField
    onFieldChange: (field: ContentField) => void
}

export const ContentFieldSelector = ({ selectedField, onFieldChange }: ContentFieldSelectorProps) => {
    return (
        <div className={cx('field-selector')}>
            {(Object.keys(CONTENT_PROMPTS) as ContentField[]).map((field) => (
                <button
                    key={field}
                    className={cx('field-button', { active: selectedField === field })}
                    onClick={() => onFieldChange(field)}
                >
                    {CONTENT_PROMPTS[field].label}
                </button>
            ))}
        </div>
    )
}

export default ContentFieldSelector
