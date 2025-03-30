import classNames from 'classnames/bind'
import styles from './ProfileForm.module.scss'
import { User } from 'src/types/user.type'
import Button from 'src/components/Button'
import { FiEdit3 } from 'react-icons/fi'
import { schema, SchemaType } from 'src/utils/rules.util'
import { AppContext } from 'src/contexts/app.context'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import uploadApi from 'src/apis/upload.api'
import { toast } from 'react-toastify'
import handleFormError from 'src/utils/handleFormError.util'
import { Config } from 'src/config/common'
import { FaFacebook, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import { AiOutlineDeleteRow } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

type FormData = Pick<SchemaType, 'avatar' | 'bio' | 'social_links' | 'username'>

const FormSchema = schema.pick(['avatar', 'bio', 'social_links', 'username'])

const getIcon = (url: string) => {
    if (url?.includes('facebook.com')) return <FaFacebook />
    if (url?.includes('instagram.com')) return <FaInstagram />
    if (url?.includes('twitter.com')) return <FaTwitter />
    if (url?.includes('youtube.com')) return <FaYoutube />
    if (url?.includes('linkedin.com')) return <FaLinkedin />
    if (url?.includes('github.com')) return <FaGithub />
    if (url?.includes('tiktok.com')) return <FaTiktok />
    return <FaGlobe />
}

const cx = classNames.bind(styles)
interface props {
    userData: User
    onCancel: () => void
}
const ProfileForm = ({ userData, onCancel }: props) => {
    const navigate = useNavigate()
    const { setProfile, profile: currentData } = useContext(AppContext)
    const [fileImage, setFileImage] = useState<File>()
    const previewImage = useMemo(() => (fileImage ? URL.createObjectURL(fileImage) : ''), [fileImage])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const profileForm = useForm<FormData>({
        defaultValues: {
            avatar: '',
            bio: '',
            username: '',
            social_links: []
        },
        resolver: yupResolver(FormSchema)
    })

    const { fields, append, remove, replace } = useFieldArray({
        control: profileForm.control,
        name: 'social_links'
    })

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileFromLocal = event.target.files?.[0]
        if (
            fileFromLocal &&
            (fileFromLocal.size >= Config.MAX_SIZE_UPLOAD_IMAGE || !fileFromLocal.type.includes('image'))
        ) {
            toast.error(`The image exceeds the allowed upload size.`, {
                position: 'top-center'
            })
        } else {
            setFileImage(fileFromLocal)
        }
    }

    const handleUpload = () => {
        fileInputRef.current?.click()
    }

    const { mutate: updateProfileMutate, isPending: submitFormPending } = useMutation({
        mutationFn: userApi.updateProfile
    })
    const uploadAvatarMutation = useMutation({
        mutationFn: uploadApi.uploadImage
    })

    const { data, refetch, isLoading } = useQuery({
        queryKey: [`profile: ${currentData?.username}`],
        queryFn: () => userApi.getProfile(currentData?.username as string)
    })
    const profile = data?.data.data

    const avatar = profileForm.watch('avatar')
    const bio = profileForm.watch('bio')
    const username = profileForm.watch('username')

    useEffect(() => {
        if (profile) {
            profileForm.setValue('bio', profile.bio)
            profileForm.setValue('username', profile.username || '')
            profileForm.setValue('avatar', profile.avatar || '')
            if (profile.social_links && Array.isArray(profile.social_links)) {
                replace(profile.social_links)
            } else {
                replace([])
            }
        }
    }, [profile, profileForm, replace])

    const onFormSubmit = profileForm.handleSubmit(async (data) => {
        let avatar_url
        if (fileImage) {
            try {
                const form = new FormData()
                form.append('image', fileImage)
                const response = await uploadAvatarMutation.mutateAsync(form)
                avatar_url = response.data.data.image
            } catch (error) {
                console.log(error)
                toast.error('An unknown error has occurred. Please try again later.')
            }
        }
        const body = { ...data, avatar: avatar_url, social_links: data.social_links as string[] }
        updateProfileMutate(body, {
            onSuccess: (data) => {
                toast.success(data.data.message, {
                    position: 'top-center'
                })
                setProfile(data.data.data)
                onCancel()
                navigate(`/@${encodeURIComponent(data.data.data.username)}`)
            },
            onError: (error) => handleFormError<FormData>(error, profileForm)
        })
        refetch()
    })

    return (
        <form className={cx('formContainer')} method='post' onSubmit={onFormSubmit}>
            <div className={cx('formGroup')}>
                <label>Profile photo</label>
                <div className={cx('input-wrapper')}>
                    <button className={cx('avatar')} onClick={handleUpload}>
                        <img src={previewImage || avatar} alt={userData.username} />
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
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ;(event.target as any).value = null
                        }}
                    />
                </div>
            </div>

            <div className={cx('formGroup')}>
                <label htmlFor='username'>Username</label>
                <div className={cx('input-wrapper')}>
                    <input
                        type='text'
                        className={cx('txt-input', {
                            'input--error': profileForm.formState.errors.username?.message
                        })}
                        id='username'
                        {...profileForm.register('username')}
                    />
                    <span className={cx('error')}>{profileForm.formState.errors.username?.message}</span>
                    <small>www.sblog.tech/@{username}</small>
                    <small>
                        Usernames can only contain letters, numbers, underscores, and periods. Changing your username
                        will also change your profile link.
                    </small>
                </div>
            </div>
            <div className={cx('formGroup')}>
                <label>Socials</label>
                <div className={cx('input-wrapper')}>
                    {fields.map((link, index) => {
                        const value = profileForm.watch(`social_links.${index}`) || ''

                        return (
                            <div className={cx('input-wrapper')}>
                                <div key={link.id} className={cx('social-input')}>
                                    <div className={cx('social-icon')}>{getIcon(value)}</div>
                                    <input
                                        type='text'
                                        className={cx('txt-input', 'social-link', {
                                            'input--error': profileForm.formState.errors.social_links?.[index]?.message
                                        })}
                                        {...profileForm.register(`social_links.${index}`)}
                                    />
                                    <button type='button' className={cx('social-icon')} onClick={() => remove(index)}>
                                        <AiOutlineDeleteRow />
                                    </button>
                                </div>
                                {profileForm.formState.errors.social_links?.[index]?.message && (
                                    <span className={cx('error')}>
                                        {profileForm.formState.errors.social_links[index]?.message}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                    <button type='button' className={cx('add-social-btn')} onClick={() => append('')}>
                        + Add Social Link
                    </button>
                    {profileForm.formState.errors.social_links &&
                        !Array.isArray(profileForm.formState.errors.social_links) && (
                            <span className={cx('error')}>{profileForm.formState.errors.social_links?.message}</span>
                        )}
                    <small>
                        This input field allows users to enter contact links to their personal or business websites
                    </small>
                </div>
            </div>
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
                        {bio?.length || 0}/80
                    </small>
                </div>
            </div>

            <div className={cx('buttonGroup')}>
                <Button type='button' variant='secondary' className={cx('buttonGroup__btn')} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type='submit' variant='primary' className={cx('buttonGroup__btn')} loading={submitFormPending}>
                    Save
                </Button>
            </div>
        </form>
    )
}

export default ProfileForm
