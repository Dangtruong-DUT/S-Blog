import { memo, useContext } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'

import styles from './ProfileCard.module.scss'
import Button from '../Button'
import { formatter } from 'src/utils/common.util'
import { User } from 'src/types/user.type'
import { AppContext } from 'src/contexts/app.context'
import { useFollowUser, useUnfollowUser } from 'src/hooks/useFollowUser'

const cx = classNames.bind(styles)

interface ProfileCardProps {
    userData?: User
}

function ProfileCard({ userData }: ProfileCardProps) {
    const { profile } = useContext(AppContext)

    const { follow, loading: followLoading } = useFollowUser(userData?.id || '')
    const { unfollow } = useUnfollowUser(userData?.id || '')

    if (!userData) return null

    const { id, avatar, first_name, last_name, followers_count = 0, total_likes = 0, bio, email } = userData
    const profileUrl = `/@${encodeURIComponent(id)}`
    const fullName = `${first_name} ${last_name}`

    const buttonFollowClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        if (!userData.is_following) {
            follow()
        } else {
            unfollow()
        }
    }

    const isAuthor = profile?.id === id

    return (
        <div className={cx('card')}>
            <div className={cx('header')}>
                <Link to={profileUrl}>
                    <img className={cx('avatar')} src={avatar} alt={`${id}'s avatar`} />
                </Link>
                {!isAuthor && (
                    <Button
                        variant='primary'
                        outline
                        className={cx('follow-button', { following: userData.is_following })}
                        onClick={buttonFollowClick}
                        disabled={followLoading}
                    >
                        {userData.is_following ? 'Following' : followLoading ? 'Following...' : 'Follow'}
                    </Button>
                )}
            </div>

            <div className={cx('info')}>
                <Link to={profileUrl}>
                    <h3 className={cx('username')}>{email}</h3>
                    <p className={cx('name')}>{fullName}</p>
                </Link>

                <div className={cx('stats')}>
                    <span>
                        <strong>{formatter.format(followers_count || 0)}</strong> Followers
                    </span>
                    <span>
                        <strong>{formatter.format(total_likes || 0)}</strong> Likes
                    </span>
                </div>

                <p className={cx('description')}>{bio}</p>
            </div>
        </div>
    )
}

export default memo(ProfileCard, (prevProps, nextProps) => {
    return (
        prevProps.userData?.id === nextProps.userData?.id &&
        prevProps.userData?.is_following === nextProps.userData?.is_following
    )
})
