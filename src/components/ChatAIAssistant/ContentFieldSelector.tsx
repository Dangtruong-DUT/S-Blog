import { CONTENT_PROMPTS, ContentField } from 'src/constants/prompts'
import { HiDocumentText, HiInformationCircle, HiNewspaper } from 'react-icons/hi2'
import classNames from 'classnames/bind'
import styles from './ContentFieldSelector.module.scss'

const cx = classNames.bind(styles)

interface ContentFieldSelectorProps {
    selectedField: ContentField
    onFieldChange: (field: ContentField) => void
    className?: string
}

const fieldIcons = {
    title: HiDocumentText,
    description: HiInformationCircle,
    content: HiNewspaper
}

export const ContentFieldSelector = ({ selectedField, onFieldChange }: ContentFieldSelectorProps) => {
    return (
        <div className={cx('field-selector')}>
            {(Object.keys(CONTENT_PROMPTS) as ContentField[]).map((field) => {
                const Icon = fieldIcons[field]
                return (
                    <button
                        key={field}
                        className={cx('field-button', { active: selectedField === field })}
                        onClick={() => onFieldChange(field)}
                    >
                        <Icon className={cx('field-icon')} />
                        <span>{CONTENT_PROMPTS[field].label}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default ContentFieldSelector
