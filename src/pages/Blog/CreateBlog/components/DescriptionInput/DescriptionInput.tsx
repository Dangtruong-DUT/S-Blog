import styles from './DescriptionInput.module.scss'
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

export default function DescriptionInput<T extends FieldValues = FieldValues>({ register, error }: Props<T>) {
    return (
        <div className={styles.descriptionInputWrapper}>
            <label className={styles.label}>Description</label>
            <input
                type='text'
                placeholder='Description...'
                className={styles.input}
                {...register('subtitle' as Path<T>)}
            />{' '}
            <span className={styles.error}>{error}</span>
        </div>
    )
}
