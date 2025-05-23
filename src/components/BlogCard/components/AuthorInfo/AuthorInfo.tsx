import Tippy from '@tippyjs/react/headless'
import styles from './AuthorInfo.module.scss'
import classNames from 'classnames/bind'
import { memo, useCallback } from 'react'
import PopperWrapper from 'src/components/Popper'
import ProfileCard from 'src/components/ProfileCard'
import { User } from 'src/types/user.type'
import useIsMobile from 'src/hooks/useIsMobile'

const cx = classNames.bind(styles)

interface Props {
    userData?: User
    categoryName?: string
    onClickProfile: (e: React.MouseEvent) => void
}

const AuthorInfo = ({ userData, categoryName, onClickProfile }: Props) => {
    const fullName = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim()
    const isMobile = useIsMobile()

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
            <span className={cx('by-label')}>BY</span>
            <strong className={cx('author-container')}>
                <Tippy
                    interactive
                    placement={isMobile ? 'bottom' : 'bottom-start'}
                    appendTo='parent'
                    render={renderProfileCard}
                    touch={['hold', 500]} // Trên thiết bị cảm ứng, giữ 500ms để hiển thị profile card
                >
                    <button
                        onClick={onClickProfile}
                        className={cx('link-button')}
                        aria-label={`Xem hồ sơ của ${fullName}`}
                    >
                        <span className={cx('link')}>{fullName}</span>
                    </button>
                </Tippy>
            </strong>
            <span className={cx('category-label')}>
                IN <strong>{categoryName}</strong>
            </span>
        </h3>
    )
}

export default memo(AuthorInfo)
