import { Controller, Control, FieldErrors, FieldValues, FieldError, Path } from 'react-hook-form'
import SingleSelectCategory from 'src/components/MultiSelectCategory'
import styles from './CategorySelect.module.scss'

interface Props<T extends FieldValues = FieldValues> {
    control: Control<T>
    errors: FieldErrors<T>
}

function getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error
    if (error && typeof (error as FieldError).message === 'string') return (error as FieldError).message || ''
    return ''
}

export default function CategorySelect<T extends FieldValues = FieldValues>({ control, errors }: Props<T>) {
    return (
        <Controller
            control={control}
            name={'category' as Path<T>}
            render={({ field }) => (
                <div className={styles.categorySelectWrapper}>
                    <label className={styles.label}>Category</label>
                    <SingleSelectCategory selectedCategory={field.value as string} onChange={field.onChange} />
                    <span className={styles.error}>{getErrorMessage(errors['category'])}</span>
                </div>
            )}
        />
    )
}
