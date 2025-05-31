import classNames from 'classnames/bind'
import { useContext, useState, useRef, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FiEdit3 } from 'react-icons/fi'

import styles from '../../ProfileForm.module.scss'
import Button from 'src/components/Button'
import { User } from 'src/types/user.type'
import { schema, SchemaType } from 'src/utils/rules.util'
import { AppContext } from 'src/contexts/app.context'
import userApi from 'src/apis/user.api'
import uploadApi from 'src/apis/upload.api'
import handleFormError from 'src/utils/handleFormError.util'
import { Config } from 'src/config/common'

type ProfileFormData = Pick<SchemaType, 'avatar' | 'bio'>

const ProfileFormSchema = schema.pick(['avatar', 'bio'])

const cx = classNames.bind(styles)

interface Props {
    userData: User
    profile?: User
    onCancel: () => void
}

const ProfileInfoSection = ({ userData, profile, onCancel }: Props) => {
    const navigate = useNavigate()
    const { setProfile, profile: currentData } = useContext(AppContext)
    const [fileImage, setFileImage] = useState<File>()
    const previewImage = useMemo(
        () => (fileImage ? URL.createObjectURL(fileImage) : userData.avatar),
        [fileImage, userData.avatar]
    )
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Profile form for avatar and bio
    const profileForm = useForm<ProfileFormData>({
        defaultValues: {
            avatar: '',
            bio: ''
        },
        resolver: yupResolver(ProfileFormSchema)
    })

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileFromLocal = event.target.files?.[0]
        if (
            fileFromLocal &&
            (fileFromLocal.size >= Config.MAX_SIZE_UPLOAD_IMAGE || !fileFromLocal.type.includes('image'))
        ) {
            toast.error('The image exceeds the allowed upload size.', {
                position: 'top-center'
            })
        } else {
            setFileImage(fileFromLocal)
        }
    }

    const handleUpload = () => {
        fileInputRef.current?.click()
    }

    // Mutations
    const { mutate: updateProfileMutate, isPending: submitFormPending } = useMutation({
        mutationFn: userApi.updateProfile
    })

    const uploadAvatarMutation = useMutation({
        mutationFn: uploadApi.uploadImage
    })

    // Profile form submit (avatar + bio)
    const onProfileSubmit = profileForm.handleSubmit(async (data) => {
        let avatar_url = data.avatar

        if (fileImage) {
            try {
                const form = new FormData()
                form.append('image', fileImage)
                const response = await uploadAvatarMutation.mutateAsync(form)
                avatar_url = response.data.data.url
            } catch {
                toast.error('An unknown error has occurred. Please try again later.')
                return
            }
        }

        const body = {
            bio: data.bio as string,
            avatar: avatar_url as string,
            first_name: profile?.first_name,
            last_name: profile?.last_name
        }

        const payload = {
            body,
            userId: currentData?.id as string
        }

        updateProfileMutate(payload, {
            onSuccess: (data) => {
                toast.success(data.data.message, {
                    position: 'top-center'
                })
                setProfile(data.data.data)
                onCancel()
                navigate(`/@${encodeURIComponent(data.data.data.id)}`)
            },
            onError: (error) => handleFormError<ProfileFormData>(error, profileForm)
        })
    })

    // Update form when profile data changes
    useEffect(() => {
        if (profile) {
            profileForm.setValue('bio', profile.bio || '')
            profileForm.setValue('avatar', profile.avatar || '')
        }
    }, [profile, profileForm])

    return (
        <form className={cx('profileSection')} method='post' onSubmit={onProfileSubmit}>
            <h3 className={cx('sectionTitle')}>Profile Information</h3>

            {/* Profile Photo Section */}
            <div className={cx('formGroup')}>
                <label>Profile photo</label>
                <div className={cx('input-wrapper')}>
                    <button type='button' className={cx('avatar')} onClick={handleUpload}>
                        <img src={previewImage} alt={userData.first_name} />
                        <span className={cx('editIcon')}>
                            <FiEdit3 />
                        </span>
                    </button>
                    <input
                        style={{ display: 'none' }}
                        type='file'
                        accept='.jpg,.jpeg,.png'
                        ref={fileInputRef}
                        onChange={onFileChange}
                        onClick={(event) => {
                            ;(event.target as HTMLInputElement).value = ''
                        }}
                    />
                </div>
            </div>

            {/* Bio Section */}
            <div className={cx('formGroup')} style={{ border: 'none' }}>
                <label htmlFor='bio'>Bio</label>
                <div className={cx('input-wrapper')}>
                    <textarea
                        rows={2}
                        className={cx('textarea-input', 'txt-input', {
                            'input--error': profileForm.formState.errors.bio?.message
                        })}
                        id='bio'
                        {...profileForm.register('bio')}
                    />
                    <small
                        className={cx({
                            'txt-error': profileForm.formState.errors.bio?.message
                        })}
                    >
                        {profileForm.watch('bio')?.length || 0}/80
                    </small>
                </div>
            </div>

            {/* Profile Action Buttons */}
            <div className={cx('buttonGroup')}>
                <Button type='button' variant='secondary' className={cx('buttonGroup__btn')} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type='submit' variant='primary' className={cx('buttonGroup__btn')} loading={submitFormPending}>
                    Save Profile
                </Button>
            </div>
        </form>
    )
}

export default ProfileInfoSection
