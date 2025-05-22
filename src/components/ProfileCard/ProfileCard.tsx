import { useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'

import styles from './ProfileCard.module.scss'
import Button from '../Button'
import { formatter } from 'src/utils/common.util'
import { User } from 'src/types/user.type'

const cx = classNames.bind(styles)

interface ProfileCardProps {
    userData?: User
}

function ProfileCard({ userData }: ProfileCardProps) {
    const [isFollowing, setFollowing] = useState(false)

    if (!userData) return null

    const { id, avatar, first_name, last_name, followers = 0, like_count = 0, bio, email } = userData
    const profileUrl = `/@${encodeURIComponent(id)}`
    const fullName = `${first_name} ${last_name}`

    const buttonFollowClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        setFollowing(!isFollowing)
    }

    return (
        <div className={cx('card')}>
            <div className={cx('header')}>
                <Link to={profileUrl}>
                    <img className={cx('avatar')} src={avatar} alt={`${id}'s avatar`} />
                </Link>

                <Button
                    variant='primary'
                    outline
                    className={cx('follow-button', { following: isFollowing })}
                    onClick={buttonFollowClick}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            </div>

            <div className={cx('info')}>
                <Link to={profileUrl}>
                    <h3 className={cx('username')}>{email}</h3>
                    <p className={cx('name')}>{fullName}</p>
                </Link>

                <div className={cx('stats')}>
                    <span>
                        <strong>{formatter.format(followers || 0)}</strong> Followers
                    </span>
                    <span>
                        <strong>{formatter.format(like_count || 0)}</strong> Likes
                    </span>
                </div>

                <p className={cx('description')}>{bio}</p>
            </div>
        </div>
    )
}

export default ProfileCard
