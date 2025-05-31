import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames/bind'

import styles from './ProfileForm.module.scss'
import { User } from 'src/types/user.type'
import { AppContext } from 'src/contexts/app.context'
import userApi from 'src/apis/user.api'
import ProfileInfoSection from './components/ProfileInfoSection'
import SocialLinksManager from './components/SocialLinksManager'

const cx = classNames.bind(styles)

interface Props {
    userData: User
    onCancel: () => void
}

const ProfileForm = ({ userData, onCancel }: Props) => {
    const { profile: currentData } = useContext(AppContext)

    // Queries
    const { data: profileRes } = useQuery({
        queryKey: [`profile:${currentData?.id}`],
        queryFn: () => userApi.getProfile(currentData?.id as string)
    })
    const profile = profileRes?.data.data

    return (
        <div className={cx('formContainer')}>
            {/* <ProfileInfoSection userData={userData} profile={profile} onCancel={onCancel} /> */}
            {/* Social Links Section */}
            <SocialLinksManager profileId={profile?.id} />
        </div>
    )
}

export default ProfileForm
