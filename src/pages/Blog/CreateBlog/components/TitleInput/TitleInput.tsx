import styles from './TitleInput.module.scss'
import { UseFormRegister, FieldValues, Path } from 'react-hook-form'

interface Props<T extends FieldValues = FieldValues> {
    register: UseFormRegister<T>
    error: string
    value?: string
    onChange?: (value: string) => void
    context?: {
        title?: string
        description?: string
        content?: string
        category?: string
    }
}

export default function TitleInput<T extends FieldValues = FieldValues>({ register, error }: Props<T>) {
    return (
        <div className={styles.titleInputWrapper}>
            <label className={styles.label}>Title</label>
            <input type='text' placeholder='Title...' className={styles.input} {...register('title' as Path<T>)} />{' '}
            <span className={styles.error}>{error}</span>
        </div>
    )
}
