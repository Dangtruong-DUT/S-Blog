import Button from 'src/components/Button'
import styles from './FormFooter.module.scss'

interface Props {
    isAddMode: boolean
    loading: boolean
    onPreview: () => void
}

export default function FormFooter({ isAddMode, loading, onPreview }: Props) {
    return (
        <div className={styles.formFooter}>
            <Button type='button' variant='neutral' outline onClick={onPreview}>
                Preview
            </Button>
            <Button variant='primary' type='submit' loading={loading}>
                {isAddMode ? 'Public' : 'Save'}
            </Button>
        </div>
    )
}
