import EditorQuill from 'src/components/EditorQuill'
import styles from './ContentEditor.module.scss'
import { RefObject } from 'react'
import ReactQuill from 'react-quill'

interface Props {
    value: string
    onChange: (val: string) => void
    error: string
    quillRef: RefObject<ReactQuill | null>
}

export default function ContentEditor({ value, onChange, error, quillRef }: Props) {
    return (
        <div className={styles.contentEditorWrapper}>
            <label className={styles.label}>Content</label>
            <EditorQuill ref={quillRef} onChange={onChange} value={value} />
            <span className={styles.error}>{error}</span>
        </div>
    )
}
