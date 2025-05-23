import InputFile from 'src/components/InputFile/InputFile'
import thumbnailDefault from 'src/assets/images/Thumbnail.png'
import styles from './ThumbnailUpload.module.scss'

interface Props {
    value: string
    onChange: (val: string) => void
    error: string
    setFileImage: (file: File | undefined) => void
}

export default function ThumbnailUpload({ value, onChange, error, setFileImage }: Props) {
    return (
        <div className={styles.thumbnailWrapper}>
            <img src={value || thumbnailDefault} className={styles.imageReview} alt='' />
            <div className={styles.inputFileWrapper}>
                <InputFile
                    textInnerButton='Choose Thumbnail'
                    onChange={(file) => {
                        const fileURL = file !== undefined ? URL.createObjectURL(file) : ''
                        onChange(fileURL)
                        setFileImage(file)
                    }}
                />
            </div>
            <span className={styles.error}>{error}</span>
        </div>
    )
}
