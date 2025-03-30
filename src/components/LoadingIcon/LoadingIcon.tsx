import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import styles from './LoadingIcon.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

function LoadingIcon() {
    return <AiOutlineLoading3Quarters className={cx('loading-icon')} />
}

export default LoadingIcon
