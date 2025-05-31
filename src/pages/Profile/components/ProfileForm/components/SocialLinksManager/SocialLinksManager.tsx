import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import classNames from 'classnames/bind'

import styles from '../../ProfileForm.module.scss'
import SocialApi from 'src/apis/Socials.api'
import SocialLinkItem from '../SocialLinkItem/SocialLinkItem'
import { validateSocialLink, generateLocalId } from '../../utils/socialUtils.tsx'

const cx = classNames.bind(styles)

interface SocialLinksManagerProps {
    profileId?: string
}

export interface SocialField {
    id: string
    link: string
    isNew?: boolean
}

interface EditingState {
    isEditing: boolean
    isLoading: boolean
    error?: string
}

const SocialLinksManager = ({ profileId }: SocialLinksManagerProps) => {
    const [socialFields, setSocialFields] = useState<SocialField[]>([])
    const [editingStates, setEditingStates] = useState<{ [key: string]: EditingState }>({})

    // Mutations
    const { mutate: addSocialMutate } = useMutation({
        mutationFn: SocialApi.addSocial
    })

    const { mutate: deleteSocialMutate } = useMutation({
        mutationFn: SocialApi.deleteSocial
    })

    const { mutate: updateSocialMutate } = useMutation({
        mutationFn: ({ id, link }: { id: string; link: string }) => SocialApi.updateSocial(id, { link })
    })

    // Queries
    const { data: socialRes, refetch: refetchSocials } = useQuery({
        queryKey: ['socials', profileId],
        queryFn: () => SocialApi.getSocials(),
        enabled: !!profileId
    })

    const socialLinks = socialRes?.data.data

    // Initialize social links from server
    useEffect(() => {
        if (socialLinks && socialLinks.length > 0) {
            const serverLinks = socialLinks.map((link: SocialField) => ({
                id: link.id,
                link: link.link,
                isNew: false
            }))
            setSocialFields(serverLinks)
        } else {
            setSocialFields([])
        }
    }, [socialLinks])

    const onAddSocial = () => {
        // Prevent adding new social links if one is already being edited
        const hasEditingItem = Object.values(editingStates).some((state) => state.isEditing)
        if (hasEditingItem) {
            toast.warning('Please save the current social link before adding a new one.')
            return
        }

        const newId = generateLocalId()
        setSocialFields((prev) => [...prev, { id: newId, link: '', isNew: true }])

        setEditingStates((prev) => ({
            ...prev,
            [newId]: {
                isEditing: true,
                isLoading: false,
                error: undefined
            }
        }))

        // Focus the new input field after a short delay
        setTimeout(() => {
            const inputs = document.querySelectorAll('input[data-social-id]')
            const newInput = Array.from(inputs).find(
                (input) => (input as HTMLInputElement).getAttribute('data-social-id') === newId
            ) as HTMLInputElement
            if (newInput) {
                newInput.focus()
            }
        }, 100)
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

    const onCancelEdit = (id: string) => {
        const index = socialFields.findIndex((field) => field.id === id)
        const field = socialFields[index]

        // If it's a new item that hasn't been saved, remove it completely
        if (field?.isNew) {
            setSocialFields((prev) => prev.filter((_, i) => i !== index))
            setEditingStates((prev) => {
                const newState = { ...prev }
                delete newState[id]
                return newState
            })
            return
        }

        // For existing items, revert to original value and stop editing
        const originalValue = socialLinks?.find((link: SocialField) => link.id === id)?.link || ''
        setSocialFields((prev) => prev.map((item, i) => (i === index ? { ...item, link: originalValue } : item)))

        setEditingStates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                isEditing: false,
                error: undefined
            }
        }))
    }

    const onSaveSocial = async (id: string) => {
        const index = socialFields.findIndex((field) => field.id === id)
        const field = socialFields[index]
        if (!field) return

        const link = field.link.trim()

        // Validate
        const error = validateSocialLink(link, socialFields, id)
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

        const isNew = field.isNew

        if (isNew) {
            // Add new social link
            addSocialMutate(
                { link },
                {
                    onSuccess: (response) => {
                        const newSocial = response.data.data
                        setSocialFields((prev) =>
                            prev.map((item, i) =>
                                i === index ? { id: newSocial.id, link: newSocial.link, isNew: false } : item
                            )
                        )
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isEditing: false,
                                isLoading: false
                            }
                        }))
                        toast.success('Social link added successfully!')
                        refetchSocials()
                    },
                    onError: () => {
                        const errorMsg = 'Failed to add social link'
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isLoading: false,
                                error: errorMsg
                            }
                        }))
                        toast.error('Failed to add social link')
                    }
                }
            )
        } else {
            // Update existing social link
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
                        toast.success('Social link updated successfully!')
                        refetchSocials()
                    },
                    onError: () => {
                        const errorMsg = 'Failed to update social link'
                        setEditingStates((prev) => ({
                            ...prev,
                            [id]: {
                                ...prev[id],
                                isLoading: false,
                                error: errorMsg
                            }
                        }))
                        toast.error('Failed to update social link')
                    }
                }
            )
        }
    }

    const onDeleteSocial = (id: string) => {
        const index = socialFields.findIndex((field) => field.id === id)
        const field = socialFields[index]
        if (!field) return

        // If it's a new item that hasn't been saved to server, just remove from form
        if (field.isNew || !field.link.trim()) {
            setSocialFields((prev) => prev.filter((_, i) => i !== index))
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

        // Delete from server
        deleteSocialMutate(id, {
            onSuccess: () => {
                setSocialFields((prev) => prev.filter((_, i) => i !== index))
                toast.success('Social link deleted!')
                setEditingStates((prev) => {
                    const newState = { ...prev }
                    delete newState[id]
                    return newState
                })
                refetchSocials()
            },
            onError: () => {
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
        })
    }

    const updateSocialField = (id: string, newValue: string) => {
        setSocialFields((prev) => prev.map((item) => (item.id === id ? { ...item, link: newValue } : item)))
    }

    const isAnyEditing = Object.values(editingStates).some((s) => s.isEditing)

    return (
        <div className={cx('socialSection')}>
            <div className={cx('formGroup', 'social-links-container')}>
                <div className={cx('input-wrapper')}>
                    <div className={cx('social-container')}>
                        {socialFields.map((field) => {
                            const { id, link, isNew } = field
                            const isNewItem = !!isNew
                            const editingState = editingStates[id] || {
                                isEditing: isNewItem,
                                isLoading: false,
                                error: undefined
                            }

                            return (
                                <SocialLinkItem
                                    key={id}
                                    id={id}
                                    link={link}
                                    isNew={isNew}
                                    editingState={editingState}
                                    onEdit={onEditSocial}
                                    onSave={onSaveSocial}
                                    onCancel={onCancelEdit}
                                    onDelete={onDeleteSocial}
                                    onChange={(value) => updateSocialField(id, value)}
                                    onClearError={() => {
                                        setEditingStates((prev) => ({
                                            ...prev,
                                            [id]: {
                                                ...prev[id],
                                                error: undefined
                                            }
                                        }))
                                    }}
                                    isAnyEditing={isAnyEditing}
                                />
                            )
                        })}

                        <button
                            type='button'
                            className={cx('add-social-btn')}
                            onClick={onAddSocial}
                            disabled={isAnyEditing}
                            title={isAnyEditing ? 'Save current edit before adding new link' : 'Add Social Link'}
                        >
                            <span className={cx('add-icon')}>+</span>
                            <span className={cx('add-text')}>Add Social Link</span>
                        </button>

                        <div className={cx('social-help-text')}>
                            💡 Add your social media profiles to help others connect with you. Press{' '}
                            <strong>Enter</strong> to save or <strong>Escape</strong> to cancel editing.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SocialLinksManager
