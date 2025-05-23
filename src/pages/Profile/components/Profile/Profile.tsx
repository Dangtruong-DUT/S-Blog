import classNames from 'classnames/bind'
import Modal from 'react-modal'
import styles from './Profile.module.scss'
import Button from 'src/components/Button'
import { PiShareFat } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { routes } from 'src/config'
import { User } from 'src/types/user.type'
import { useContext, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { formatter, getDomainIconWithColor } from 'src/utils/common.util'

import { IoCloseOutline } from 'react-icons/io5'
import ProfileForm from '../ProfileForm'

const cx = classNames.bind(styles)
interface props {
    userData: User
    onFollow?: () => void
    onUnfollow?: () => void
    followLoading?: boolean
    followSuccess?: boolean | null
}
function Profile({ userData, onFollow, onUnfollow, followLoading }: props) {
    const [isModalContactShow, setModalContactShow] = useState<boolean>(false)
    const [isModalEditProfileShow, setModalEditProfileShow] = useState<boolean>(false)
    const [isFollowing, setFollowing] = useState<boolean | undefined>(userData.is_following)
    const { profile } = useContext(AppContext)
    const navigate = useNavigate()
    const onSettingClick = () => {
        navigate(routes.setting)
    }
    const handleToggleFollow = () => {
        setFollowing((prev) => !prev)
        if (!isFollowing && onFollow) onFollow()
        if (isFollowing && onUnfollow) onUnfollow()
    }
    const isCurrentUser = profile?.id == userData.id

    const renderModalContact = () => {
        return (
            <div className={cx('modal__content')}>
                <div className={cx('modal__header')}>
                    <h2 className={cx('modal__heading')}>Contact</h2>
                    <button className={cx('modal__btn-close')} onClick={() => setModalContactShow(false)}>
                        <IoCloseOutline size={'2.4rem'} />
                    </button>
                </div>
                <div className={cx('modal__contacts')}>
                    {userData.social_links?.map((link, index) => {
                        const { icon, name } = getDomainIconWithColor(link.link)
                        return (
                            <a
                                key={index}
                                href={link.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={cx('contact-item')}
                            >
                                {icon}
                                <span className={cx('contact-name')}>{name}</span>
                            </a>
                        )
                    })}
                </div>
            </div>
        )
    }

    const renderModalEditProfile = () => {
        return (
            <div className={cx('modal__content')}>
                <div className={cx('modal__header')}>
                    <h1 className={cx('modal__heading')}>Edit profile </h1>
                    <button className={cx('modal__btn-close')} onClick={() => setModalEditProfileShow(false)}>
                        <IoCloseOutline size={'2.4rem'} />
                    </button>
                </div>
                <div className={cx('modal__form')}>
                    <ProfileForm
                        onCancel={() => {
                            setModalEditProfileShow(false)
                        }}
                        userData={userData}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className={cx('profileWrapper')}>
            <div className={cx('profile-left')}>
                <img src={userData.avatar} alt='' className={cx('profile__img')} />
            </div>{' '}
            <div className={cx('profile-right')}>
                {' '}
                <div className={cx('profile__row', 'profile__info-row')}>
                    <div className={cx('profile__info-wrapper')}>
                        <h1 className={cx('profile__name')}>{userData.email}</h1>
                        <h2 className={cx('profile__username')}>{userData?.first_name + ' ' + userData?.last_name}</h2>
                    </div>
                </div>
                <div className={cx('profile__row', 'profile__buttons-row')}>
                    {isCurrentUser ? (
                        <>
                            <Button
                                variant='primary'
                                className={cx('profile__btn')}
                                onClick={() => {
                                    setModalEditProfileShow(true)
                                }}
                            >
                                Edit
                            </Button>
                            <Button variant='secondary' onClick={onSettingClick} className={cx('profile__btn')}>
                                Setting
                            </Button>
                            <Button variant='secondary' className={cx('profile__btn')} title='Share Profile'>
                                <PiShareFat size={'2.2rem'} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant={!isFollowing ? 'primary' : 'secondary'}
                                onClick={handleToggleFollow}
                                className={cx('profile__btn')}
                                disabled={followLoading}
                            >
                                {!isFollowing ? (followLoading ? 'Loading...' : 'Follow') : 'Following'}
                            </Button>
                            <Button
                                variant='secondary'
                                className={cx('profile__btn')}
                                onClick={() => setModalContactShow(true)}
                            >
                                Contact
                            </Button>
                            <Button variant='secondary' className={cx('profile__btn')} title='Share Profile'>
                                <PiShareFat size={'2.2rem'} />
                            </Button>
                        </>
                    )}
                </div>
                <div className={cx('stats')}>
                    <span>
                        <strong>{formatter.format(userData.followers_count || 0)}</strong> Followers
                    </span>
                    <span>
                        <strong>{formatter.format(userData.total_likes || 0)}</strong> Likes
                    </span>
                </div>
                <h2 className={cx('profile__bio')}>{userData?.bio} </h2>
            </div>
            {/* {Modal contact} */}
            <Modal
                isOpen={isModalContactShow}
                onRequestClose={() => {
                    setModalContactShow(false)
                }}
                overlayClassName={cx('modal__overlay')}
                className={cx('modal')}
            >
                {renderModalContact()}
            </Modal>
            <Modal
                isOpen={isModalEditProfileShow}
                onRequestClose={() => {
                    setModalEditProfileShow(false)
                }}
                overlayClassName={cx('modal__overlay')}
                className={cx('modal')}
            >
                {renderModalEditProfile()}
            </Modal>
        </div>
    )
}

export default Profile
