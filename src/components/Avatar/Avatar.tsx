import classNames from 'classnames/bind'
import styles from './Avatar.module.scss'
import { CSSProperties } from 'react'

const cx = classNames.bind(styles)
interface Props {
    image: string
    className?: string
    altValue?: string
    dataSize?: string
    isLive?: boolean
}

function Avatar({ image, className, altValue = '', dataSize = '32px', isLive = false }: Props) {
    const classNames = cx('wrapper', {
        [className || '']: className,
        'live-avatar-border': isLive
    })

    return (
        <div
            className={classNames}
            style={{ '--size': dataSize } as CSSProperties} // Explicitly cast to CSSProperties
        >
            <img className={cx('image')} src={image} alt={altValue} />
        </div>
    )
}

export default Avatar
