import Modal from 'react-modal'
import Button from 'src/components/Button'
import classNames from 'classnames/bind'
import styles from './PreviewModal.module.scss'

const cx = classNames.bind(styles)

interface PreviewModalProps {
    isOpen: boolean
    onRequestClose: () => void
    getContentHtml: () => string
}

export default function PreviewModal({ isOpen, onRequestClose, getContentHtml }: PreviewModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName={cx('modalOverlay')}
            className={cx('modal')}
            contentLabel='Preview Modal'
        >
            <div className={cx('modalContent')}>
                <h2 className={cx('modal__heading')}>Preview Post</h2>
                <div
                    className={cx('previewContent', 'ql-editor', 'htmlConverter')}
                    dangerouslySetInnerHTML={{ __html: getContentHtml() }}
                />
                <div className={cx('modal__footer')}>
                    <Button variant='neutral' onClick={onRequestClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
