import classNames from 'classnames/bind'
import styles from './ManageProfile.module.scss'
import Button from 'src/components/Button'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { SchemaType, schema } from 'src/utils/rules.util'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'src/components/InputV2'
import handleFormError from 'src/utils/handleFormError.util'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import userImage from 'src/assets/images/user_image.png'
import InputFile from 'src/components/InputFile/InputFile'
import Skeleton from './components/Skeleton'
import uploadApi from 'src/apis/upload.api'

const cx = classNames.bind(styles)
type FormData = Pick<SchemaType, 'avatar' | 'username' | 'bio' | 'first_name' | 'last_name'>
const FormSchema = schema.pick(['avatar', 'bio', 'username', 'first_name', 'last_name'])
function Profile() {
    const { setProfile, profile: currentData } = useContext(AppContext)
    const [fileImage, setFileImage] = useState<File>()
    const previewImage = useMemo(() => (fileImage ? URL.createObjectURL(fileImage) : ''), [fileImage])
    const profileForm = useForm<FormData>({
        defaultValues: {
            avatar: '',
            bio: '',
            username: '',
            first_name: '',
            last_name: ''
        },
        resolver: yupResolver(FormSchema)
    })
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
    useEffect(() => {
        if (profile) {
            profileForm.setValue('bio', profile.bio)
            profileForm.setValue('username', profile.username || '')
            profileForm.setValue('last_name', profile.last_name || '')
            profileForm.setValue('first_name', profile.first_name || '')
            profileForm.setValue('avatar', profile.avatar || '')
        }
    }, [profile, profileForm])

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
        const body = { ...data, avatar: avatar_url }
        updateProfileMutate(body, {
            onSuccess: (data) => {
                toast.success(data.data.message, {
                    position: 'top-center'
                })
                setProfile(data.data.data)
            },
            onError: (error) => handleFormError<FormData>(error, profileForm)
        })
        refetch()
    })
    return (
        <div className={cx('profile')}>
            <h1 className={cx('profile__title')}>Manage account</h1>
            {isLoading && (
                <>
                    <Skeleton />
                </>
            )}
            {!isLoading && (
                <form className={cx('formWrapper')} onSubmit={onFormSubmit} method='post' noValidate>
                    <div className={cx('formBlockWrapper')}>
                        <div className={cx('form-block')}>
                            <div className={cx('form-group')}>
                                <label htmlFor='email' className={cx('form-group__label')}>
                                    Email
                                </label>
                                <div
                                    className={cx('form-group__input', {
                                        'form-group__input--disable': true
                                    })}
                                >
                                    {profile?.email}
                                </div>
                                <span className={cx('form-group__error')}></span>
                            </div>
                            <div className={cx('form-group')}>
                                <Input
                                    type='text'
                                    register={profileForm.register}
                                    name='username'
                                    errorMessage={profileForm.formState.errors.username?.message}
                                    label='username'
                                    id='Username'
                                    placeholder='Enter your username...'
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <Input
                                    type='text'
                                    register={profileForm.register}
                                    name='bio'
                                    errorMessage={profileForm.formState.errors.bio?.message}
                                    label='Bio'
                                    id='bio'
                                    placeholder='A short description about you...'
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <Input
                                    type='text'
                                    name='first_name'
                                    register={profileForm.register}
                                    errorMessage={profileForm.formState.errors.first_name?.message}
                                    label='First name'
                                    id='first_name'
                                    placeholder='Enter your first name...'
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <Input
                                    type='text'
                                    register={profileForm.register}
                                    name='last_name'
                                    errorMessage={profileForm.formState.errors.last_name?.message}
                                    label='Last name'
                                    id='last_name'
                                    placeholder='Enter your last name...'
                                />
                            </div>
                        </div>
                        <div className={cx('form-block')}>
                            <p className={cx('chooseImage-heading')}>Avatar</p>
                            <div className={cx('image-wrapper')}>
                                <img src={previewImage || avatar || userImage} className={cx('imageReview')} alt='' />
                            </div>
                            <InputFile onChange={setFileImage} />
                            <span className={cx('chooseImage-desc')}>Maximum file size: 1 MB</span>
                            <span className={cx('chooseImage-desc')}>Formats: .JPEG, .PNG</span>
                        </div>
                    </div>
                    <Button
                        variant='primary'
                        type='submit'
                        className={cx('form-btnSubmit')}
                        disabled={submitFormPending}
                        loading={submitFormPending}
                    >
                        Save
                    </Button>
                </form>
            )}
        </div>
    )
}

export default Profile
