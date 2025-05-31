import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames/bind'

import styles from './ProfileForm.module.scss'
import { AppContext } from 'src/contexts/app.context'
import userApi from 'src/apis/user.api'
import SocialLinksManager from './components/SocialLinksManager'

const cx = classNames.bind(styles)

const ProfileForm = () => {
    const { profile: currentData } = useContext(AppContext)

    // Queries
    const { data: profileRes } = useQuery({
        queryKey: [`profile:${currentData?.id}`],
        queryFn: () => userApi.getProfile(currentData?.id as string)
    })
    const profile = profileRes?.data.data

    return (
        <div className={cx('formContainer')}>
            {/* Social Links Section */}
            <SocialLinksManager profileId={profile?.id} />
        </div>
    )
}

export default ProfileForm
