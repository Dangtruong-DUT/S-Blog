import classNames from 'classnames/bind'
import { FiEdit3 } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'

import styles from '../../ProfileForm.module.scss'
import { getSocialIcon } from '../../utils/socialUtils'

const cx = classNames.bind(styles)

interface SocialLinkItemProps {
    id: string
    link: string
    isNew?: boolean
    editingState: {
        isEditing: boolean
        isLoading: boolean
        error?: string
    }
    onEdit: (id: string) => void
    onSave: (id: string) => void
    onCancel: (id: string) => void
    onDelete: (id: string) => void
    onChange: (value: string) => void
    onClearError: () => void
    isAnyEditing: boolean
}

const SocialLinkItem = ({
    id,
    link,
    editingState,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onChange,
    onClearError,
    isAnyEditing
}: SocialLinkItemProps) => {
    const errorMsg = editingState.error

    return (
        <div className={cx('social-item')}>
            <div
                className={cx('social-input', {
                    'social-input--error': !!errorMsg,
                    'social-input--editing': editingState.isEditing
                })}
            >
                <div className={cx('social-icon')}>{getSocialIcon(link)}</div>
                <input
                    type='text'
                    placeholder='Enter social media URL (e.g., https://facebook.com/username)'
                    className={cx('social-link')}
                    value={link}
                    data-social-id={id}
                    disabled={!editingState.isEditing}
                    onChange={(e) => {
                        onChange(e.target.value)
                        // Clear error when user starts typing
                        if (editingState.error) {
                            onClearError()
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && editingState.isEditing) {
                            e.preventDefault()
                            onSave(id)
                        } else if (e.key === 'Escape' && editingState.isEditing) {
                            e.preventDefault()
                            onCancel(id)
                        }
                    }}
                />
                <div className={cx('social-actions')}>
                    {editingState.isEditing ? (
                        <>
                            <button
                                type='button'
                                className={cx('icon-btn', 'icon-btn--save')}
                                onClick={() => onSave(id)}
                                disabled={editingState.isLoading}
                                title='Save (Enter)'
                            >
                                {editingState.isLoading ? <div className={cx('loading-spinner')} /> : '✓'}
                            </button>
                            <button
                                type='button'
                                className={cx('icon-btn', 'icon-btn--cancel')}
                                onClick={() => onCancel(id)}
                                disabled={editingState.isLoading}
                                title='Cancel (Escape)'
                            >
                                ✕
                            </button>
                        </>
                    ) : (
                        <button
                            type='button'
                            className={cx('icon-btn', 'icon-btn--edit')}
                            onClick={() => onEdit(id)}
                            disabled={editingState.isLoading || isAnyEditing}
                            title='Edit'
                        >
                            <FiEdit3 />
                        </button>
                    )}
                    <button
                        type='button'
                        className={cx('icon-btn', 'icon-btn--delete')}
                        onClick={() => onDelete(id)}
                        disabled={editingState.isLoading}
                        title='Delete'
                    >
                        {editingState.isLoading ? <div className={cx('loading-spinner')} /> : <AiOutlineDelete />}
                    </button>
                </div>
            </div>
            {errorMsg && <span className={cx('error')}>{errorMsg}</span>}
        </div>
    )
}

export default SocialLinkItem
