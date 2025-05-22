import Modal from 'react-modal'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import classNames from 'classnames/bind'
import styles from './BlogCard.module.scss'
import { memo } from 'react'

const cx = classNames.bind(styles)

interface ConfirmDeleteModalProps {
    isOpen: boolean
    isLoading: boolean
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmDeleteModal = ({ isOpen, isLoading, onConfirm, onCancel }: ConfirmDeleteModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={cx('modal__overlay')}
            className={cx('modal')}
            ariaHideApp={false}
            contentLabel='Confirm Delete Modal'
        >
            <div className={cx('modal__content')}>
                <p className={cx('modal__title')}>Are you sure you want to delete this Post?</p>
                <div className={cx('modal__actions')}>
                    <button
                        type='button'
                        className={cx('modal__button')}
                        onClick={onConfirm}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <AiOutlineLoading3Quarters className={cx('loader')} size='2.4rem' aria-label='Loading' />
                        ) : (
                            'Delete'
                        )}
                    </button>
                    <button type='button' className={cx('modal__button')} onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default memo(ConfirmDeleteModal)
