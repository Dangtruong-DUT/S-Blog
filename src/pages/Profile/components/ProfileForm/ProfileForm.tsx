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
import { AiOutlineDelete, AiOutlineClose } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import SocialApi from 'src/apis/Socials.api'

type FormData = Pick<SchemaType, 'avatar' | 'bio' | 'social_links'>

const FormSchema = schema.pick(['avatar', 'bio', 'social_links'])

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

interface Props {
    userData: User
    onCancel: () => void
}

const ProfileForm = ({ userData, onCancel }: Props) => {
    const navigate = useNavigate()
    const { setProfile, profile: currentData } = useContext(AppContext)
    const [fileImage, setFileImage] = useState<File>()
    const previewImage = useMemo(
        () => (fileImage ? URL.createObjectURL(fileImage) : userData.avatar),
        [fileImage, userData.avatar]
    )
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Track editing state per social link
    const [editingStates, setEditingStates] = useState<{
        [key: string]: {
            isEditing: boolean
            isLoading: boolean
            error?: string
        }
    }>({})

    const profileForm = useForm<FormData>({
        defaultValues: {
            avatar: '',
            bio: '',
            social_links: []
        },
        resolver: yupResolver(FormSchema)
    })

    const { fields, append, remove, replace, update } = useFieldArray({
        control: profileForm.control,
        name: 'social_links'
    })

    // Remove SocialField type and use correct type
    const socialFields = fields as { id: string; link: string }[]

    // Generate stable local IDs for new items
    const generateLocalId = () => `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

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

    const { mutate: updateProfileMutate, isPending: submitFormPending } = useMutation({
        mutationFn: userApi.updateProfile
    })

    const { mutate: addSocialMutate } = useMutation({
        mutationFn: SocialApi.addSocial
    })

    const { mutate: deleteSocialMutate } = useMutation({
        mutationFn: SocialApi.deleteSocial
    })

    const { mutate: updateSocialMutate } = useMutation({
        mutationFn: ({ id, link }: { id: string; link: string }) => SocialApi.updateSocial(id, { link })
    })

    const uploadAvatarMutation = useMutation({
        mutationFn: uploadApi.uploadImage
    })

    const { data: profileRes } = useQuery({
        queryKey: [`profile:${currentData?.id}`],
        queryFn: () => userApi.getProfile(currentData?.id as string)
    })
    const profile = profileRes?.data.data

    const { data: socialRes, refetch: refetchSocials } = useQuery({
        queryKey: ['socials', profile?.id],
        queryFn: () => SocialApi.getSocials(),
        enabled: !!profile?.id
    })

    const socialLinks = socialRes?.data.data

    useEffect(() => {
        if (profile) {
            profileForm.setValue('bio', profile.bio)
            profileForm.setValue('avatar', profile.avatar || '')
        }
    }, [profile, profileForm])

    // Initialize or update social links from server
    useEffect(() => {
        if (socialLinks) {
            const serverLinks = socialLinks.map((link) => ({
                id: link.id,
                link: link.link
            }))
            if (JSON.stringify(serverLinks) !== JSON.stringify(socialFields)) {
                replace(serverLinks)
            }
        }
    }, [socialLinks, replace, socialFields])

    const onFormSubmit = profileForm.handleSubmit(async (data) => {
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
            onError: (error) => handleFormError<FormData>(error, profileForm)
        })
    })

    // Validate social link
    const validateSocialLink = (link: string, currentId?: string): string | undefined => {
        if (!link.trim()) return 'Link cannot be empty'

        try {
            const url = new URL(link)
            if (!['http:', 'https:'].includes(url.protocol)) {
                return 'URL must start with http:// or https://'
            }
        } catch {
            return 'Invalid URL format'
        }

        // Check for duplicates (ignore current item)
        const isDuplicate = socialFields.some(
            (field) => field.link.trim().toLowerCase() === link.trim().toLowerCase() && field.id !== currentId
        )

        if (isDuplicate) return 'Duplicate link'

        return undefined
    }

    const onAddSocial = () => {
        // Check if there's already an unsaved item being edited
        // (No longer using isNew, so just allow adding)
        const newId = generateLocalId()
        append({ id: newId, link: '' })
        setEditingStates((prev) => ({
            ...prev,
            [newId]: {
                isEditing: true,
                isLoading: false,
                error: undefined
            }
        }))
    }

    const onEditSocial = (id: string) => {
        setEditingStates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                isEditing: true,
                error: undefined
            }
        }))
    }

    const onCancelEdit = (id: string, index: number) => {
        // Remove if empty (new unsaved item)
        const field = socialFields[index]
        if (!field.link) {
            remove(index)
        } else {
            // Reset to original value
            const serverLink = socialLinks?.find((link) => link.id === id)
            if (serverLink) {
                update(index, { id, link: serverLink.link })
            }
        }
        setEditingStates((prev) => {
            const newState = { ...prev }
            delete newState[id]
            return newState
        })
    }

    const onSaveSocial = async (id: string, index: number) => {
        const field = socialFields[index]
        const link = field.link.trim()
        // Validate
        const error = validateSocialLink(link, id)
        if (error) {
            setEditingStates((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    error
                }
            }))
            return
        }
        setEditingStates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                isLoading: true,
                error: undefined
            }
        }))
        // If the id is not in the server, treat as add
        const isNew = !socialLinks?.some((l) => l.id === id)
        if (isNew) {
            addSocialMutate(
                { link },
                {
                    onSuccess: (response) => {
                        const newSocial = response.data.data
                        update(index, { id: newSocial.id, link: newSocial.link })
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isEditing: false,
                                isLoading: false
                            }
                        }))
                        toast.success('Social link added!')
                        refetchSocials()
                    },
                    onError: () => {
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isLoading: false,
                                error: 'Failed to add social link'
                            }
                        }))
                        toast.error('Failed to add social link')
                    }
                }
            )
        } else {
            updateSocialMutate(
                { id, link },
                {
                    onSuccess: () => {
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isEditing: false,
                                isLoading: false
                            }
                        }))
                        toast.success('Social link updated!')
                        refetchSocials()
                    },
                    onError: () => {
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isLoading: false,
                                error: 'Failed to update social link'
                            }
                        }))
                        toast.error('Failed to update social link')
                    }
                }
            )
        }
    }

    const onDeleteSocial = async (id: string, index: number) => {
        // Remove if the field is empty (previously checked isNew)
        const field = socialFields[index]
        if (!field.link) {
            remove(index)
            setEditingStates((prev) => {
                const newState = { ...prev }
                delete newState[id]
                return newState
            })
            return
        }
        setEditingStates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                isLoading: true
            }
        }))

        try {
            await deleteSocialMutate(id)
            remove(index)
            toast.success('Social link deleted!')

            setEditingStates((prev) => {
                const newState = { ...prev }
                delete newState[id]
                return newState
            })

            // Refresh social links
            await refetchSocials()
        } catch {
            setEditingStates((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    isLoading: false,
                    error: 'Failed to delete social link'
                }
            }))
            toast.error('Failed to delete social link')
        }
    }

    return (
        <form className={cx('formContainer')} method='post' onSubmit={onFormSubmit}>
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

            <div className={cx('formGroup')}>
                <label>Socials</label>
                <div className={cx('input-wrapper')}>
                    {socialFields.map((field, index) => {
                        const { id, link } = field
                        const editingState = editingStates[id] || {
                            isEditing: false,
                            isLoading: false,
                            error: undefined
                        }

                        const formError = profileForm.formState.errors.social_links?.[index] as { message?: string }
                        const errorMsg = editingState.error || formError?.message

                        return (
                            <div key={id} className={cx('input-wrapper')}>
                                <div className={cx('social-input')}>
                                    {getIcon(link)}
                                    <input
                                        type='text'
                                        placeholder='Enter social media URL (e.g., https://facebook.com/username)'
                                        className={cx('txt-input', 'social-link', {
                                            'input--error': !!errorMsg
                                        })}
                                        value={link}
                                        disabled={!editingState.isEditing || editingState.isLoading}
                                        onChange={(e) => {
                                            update(index, { ...field, link: e.target.value })
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && editingState.isEditing) {
                                                e.preventDefault()
                                                onSaveSocial(id, index)
                                            } else if (e.key === 'Escape' && editingState.isEditing) {
                                                e.preventDefault()
                                                onCancelEdit(id, index)
                                            }
                                        }}
                                    />
                                    {editingState.isEditing ? (
                                        <>
                                            <button
                                                type='button'
                                                className={cx('icon-btn')}
                                                onClick={() => onSaveSocial(id, index)}
                                                disabled={editingState.isLoading}
                                                title='Save (Enter)'
                                            >
                                                {editingState.isLoading ? 'Saving...' : <FiEdit3 />}
                                            </button>
                                            <button
                                                type='button'
                                                className={cx('icon-btn')}
                                                onClick={() => onCancelEdit(id, index)}
                                                disabled={editingState.isLoading}
                                                title='Cancel (Escape)'
                                            >
                                                <AiOutlineClose />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type='button'
                                            className={cx('icon-btn')}
                                            onClick={() => onEditSocial(id)}
                                            disabled={
                                                editingState.isLoading ||
                                                Object.values(editingStates).some((s) => s.isEditing)
                                            }
                                            title='Edit'
                                        >
                                            <FiEdit3 />
                                        </button>
                                    )}
                                    <button
                                        type='button'
                                        className={cx('icon-btn')}
                                        onClick={() => onDeleteSocial(id, index)}
                                        disabled={editingState.isLoading}
                                        title='Delete'
                                    >
                                        {editingState.isLoading ? 'Deleting...' : <AiOutlineDelete />}
                                    </button>
                                </div>
                                {errorMsg && <span className={cx('error')}>{errorMsg}</span>}
                            </div>
                        )
                    })}
                    <button
                        type='button'
                        className={cx('add-social-btn')}
                        onClick={onAddSocial}
                        disabled={Object.values(editingStates).some((s) => s.isEditing)}
                        title={
                            Object.values(editingStates).some((s) => s.isEditing)
                                ? 'Save current edit before adding new link'
                                : 'Add Social Link'
                        }
                    >
                        + Add Social Link
                    </button>
                    {profileForm.formState.errors.social_links &&
                        !Array.isArray(profileForm.formState.errors.social_links) && (
                            <span className={cx('error')}>
                                {String((profileForm.formState.errors.social_links as { message?: string })?.message)}
                            </span>
                        )}
                    <small>
                        This input field allows users to enter contact links to their personal or business websites.
                        Press Enter to save, Escape to cancel.
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
                        {profileForm.watch('bio')?.length || 0}/80
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
