import classNames from 'classnames/bind'
import styles from './ProfileCard.module.scss'
import { useState } from 'react'
import Button from '../Button'
import { useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { formatter } from 'src/utils/common.util'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)

function ProfileCard({ author }: { author: string }) {
    const [isFollowing, setFollowing] = useState(false)
    const { data } = useQuery({
        queryKey: [`profile: ${author}`],
        queryFn: () => userApi.getProfile(author as string)
    })
    const userData = data?.data.data
    if (!userData) return

    return (
        <div className={cx('card')}>
            <div className={cx('header')}>
                <Link to={`/@${encodeURIComponent(userData.username)}`}>
                    <img className={cx('avatar')} src={userData.avatar} alt={userData.username} />
                </Link>

                <Button
                    variant='primary'
                    outline
                    className={cx('follow-button', { following: isFollowing })}
                    onClick={() => setFollowing(!isFollowing)}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            </div>
            <div className={cx('info')}>
                <Link to={`/@${encodeURIComponent(userData.username)}`}>
                    <h3 className={cx('username')}>{userData.username}</h3>
                    <p className={cx('name')}>{userData.first_name + ' ' + userData.last_name}</p>
                </Link>
                <div className={cx('stats')}>
                    <span>
                        <strong>{formatter.format(userData.followers)}</strong> Followers
                    </span>
                    <span>
                        <strong>{formatter.format(userData.likes)}</strong> Likes
                    </span>
                </div>
                <p className={cx('description')}>{userData.bio}</p>
            </div>
        </div>
    )
}

export default ProfileCard
