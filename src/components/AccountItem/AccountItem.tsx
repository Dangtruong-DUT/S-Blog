import classNames from 'classnames/bind'
import styles from './AccountItem.module.scss'
import { Link } from 'react-router-dom'
import Avatar from '../Avatar'
import Avatar_default from 'src/assets/images/user_image.png'
import { MdVerified } from 'react-icons/md'

const cx = classNames.bind(styles)
interface Props {
    title: string
    nameAccount: string
    verified?: boolean
    avatar?: string
    avatarSize?: string
    className?: string
    isLive?: boolean
    to: string
}

function AccountItem({
    title,
    nameAccount,
    verified,
    avatar,
    avatarSize = '32px',
    className,
    isLive = false,
    to
}: Props) {
    const classNames = cx('wrapper', className)
    return (
        <div className={classNames}>
            <Link className={cx('accountItem-content')} to={to}>
                <Avatar isLive={isLive} image={avatar || Avatar_default} dataSize={avatarSize} altValue={nameAccount} />
                <div className={cx('info')}>
                    <h4 className={cx('info__username')}>
                        {title}
                        {verified && (
                            <span className={cx('info__verified')}>
                                <MdVerified width='20' height='20' color='rgb(32, 213, 236)' />
                            </span>
                        )}
                    </h4>
                    <p className={cx('info__name')}>{nameAccount}</p>
                </div>
            </Link>
        </div>
    )
}

export default AccountItem
