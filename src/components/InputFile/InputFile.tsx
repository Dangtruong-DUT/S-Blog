import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import { Config } from 'src/config/common'
import Button from '../Button'
import classNames from 'classnames/bind'
import styles from './InputFile.module.scss'
interface Props {
    textInnerButton?: string
    onChange?: (file?: File) => void
}
const cx = classNames.bind(styles)
export default function InputFile({ textInnerButton = 'Choose Image', onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileFromLocal = event.target.files?.[0]
        if (
            fileFromLocal &&
            (fileFromLocal.size >= Config.MAX_SIZE_UPLOAD_IMAGE || !fileFromLocal.type.includes('image'))
        ) {
            toast.error(`The image exceeds the allowed upload size.`, {
                position: 'top-center'
            })
        } else {
            if (onChange) {
                onChange(fileFromLocal)
            }
        }
    }

    const handleUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <Fragment>
            <input
                style={{ display: 'none' }}
                type='file'
                accept='.jpg,.jpeg,.png'
                ref={fileInputRef}
                onChange={onFileChange}
                onClick={(event) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(event.target as any).value = null
                }}
            />
            <Button type='button' variant='primary' outline className={cx('btn-chooseImage')} onClick={handleUpload}>
                {textInnerButton}
            </Button>
        </Fragment>
    )
}
