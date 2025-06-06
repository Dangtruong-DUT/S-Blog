import { HiPencilSquare, HiChatBubbleBottomCenterText, HiClipboardDocument } from 'react-icons/hi2'
import { ContentField } from '../../types/ai.types'
import classNames from 'classnames/bind'
import styles from './QuickAction.module.scss'

const cx = classNames.bind(styles)

interface QuickActionProps {
    field: ContentField
    prompt: string
    label: string
    onClick: () => void
}

const QuickAction = ({ field, label, onClick }: QuickActionProps) => {
    const getIcon = () => {
        switch (field) {
            case 'title':
                return <HiPencilSquare />
            case 'description':
                return <HiChatBubbleBottomCenterText />
            case 'content':
                return <HiClipboardDocument />
        }
    }

    return (
        <button className={cx('quick-action-btn')} onClick={onClick}>
            {getIcon()}
            <span>{label}</span>
        </button>
    )
}

export default QuickAction
