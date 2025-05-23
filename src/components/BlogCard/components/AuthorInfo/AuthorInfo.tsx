import Tippy from '@tippyjs/react/headless'
import styles from './AuthorInfo.module.scss'
import classNames from 'classnames/bind'
import { memo, useCallback } from 'react'
import PopperWrapper from 'src/components/Popper'
import ProfileCard from 'src/components/ProfileCard'
import { User } from 'src/types/user.type'

const cx = classNames.bind(styles)

interface Props {
    userData?: User
    categoryName?: string
    onClickProfile: (e: React.MouseEvent) => void
}

const AuthorInfo = ({ userData, categoryName, onClickProfile }: Props) => {
    const fullName = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim()

    const renderProfileCard = useCallback(
        (attrs: Record<string, unknown>) => (
            <div className={cx('popover')} tabIndex={-1} {...attrs}>
                <PopperWrapper className={cx('popover__wrapper')}>
                    <div className={cx('popover__content')}>
                        <ProfileCard userData={userData} />
                    </div>
                </PopperWrapper>
            </div>
        ),
        [userData]
    )

    return (
        <h3 className={cx('wrapper')}>
            BY
            <strong>
                <Tippy interactive placement='bottom-start' appendTo='parent' render={renderProfileCard}>
                    <span onClick={onClickProfile} className={cx('link')}>
                        {fullName}
                    </span>
                </Tippy>
            </strong>
            IN <strong>{categoryName}</strong>
        </h3>
    )
}

export default memo(AuthorInfo)
