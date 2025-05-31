import { useCallback, useState, useContext, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import useDebounce from 'src/hooks/useDebounce'
import { AppContext } from 'src/contexts/app.context'
import { UserMessage } from 'src/constants/Message'

export function useFollowUser(userId: string, delay = 400) {
    const { isAuthenticated } = useContext(AppContext)
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean | null>(null)

    const debouncedUserId = useDebounce({ value: userId, delay })

    const follow = useCallback(async () => {
        if (!isAuthenticated) {
            toast.warning(UserMessage.FOLLOW_LOGIN_REQUIRED, { autoClose: 3000 })
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            await userApi.followUser(debouncedUserId)
            setSuccess(true)
            queryClient.invalidateQueries({ queryKey: [`profile:${debouncedUserId}`] })
        } catch (err: unknown) {
            const error = err as Error
            setError(error?.message || UserMessage.FOLLOW_FAILED)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }, [debouncedUserId, isAuthenticated, queryClient])

    return { follow, loading, error, success }
}

export function useUnfollowUser(userId: string, delay = 400) {
    const { isAuthenticated } = useContext(AppContext)
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean | null>(null)

    const debouncedUserId = useDebounce({ value: userId, delay })

    const unfollow = useCallback(async () => {
        if (!isAuthenticated) {
            toast.warning(UserMessage.UNFOLLOW_LOGIN_REQUIRED, { autoClose: 3000 })
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            await userApi.unFollowUser(debouncedUserId)
            setSuccess(true)

            queryClient.invalidateQueries({ queryKey: [`profile:${debouncedUserId}`] })
        } catch (err: unknown) {
            const error = err as Error
            setError(error?.message || UserMessage.UNFOLLOW_FAILED)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }, [debouncedUserId, isAuthenticated, queryClient])

    return { unfollow, loading, error, success }
}

export function useFollowToggle(userId: string, currentFollowStatus?: boolean, delay = 400) {
    const { isAuthenticated } = useContext(AppContext)
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isFollowing, setIsFollowing] = useState(currentFollowStatus ?? false)

    const debouncedUserId = useDebounce({ value: userId, delay })

    useEffect(() => {
        setIsFollowing(currentFollowStatus ?? false)
    }, [currentFollowStatus])

    const toggleFollow = useCallback(async () => {
        if (!isAuthenticated) {
            const message = isFollowing ? UserMessage.UNFOLLOW_LOGIN_REQUIRED : UserMessage.FOLLOW_LOGIN_REQUIRED
            toast.warning(message, { autoClose: 3000 })
            return
        }

        setLoading(true)
        setError(null)

        try {
            if (isFollowing) {
                await userApi.unFollowUser(debouncedUserId)
                setIsFollowing(false)
            } else {
                await userApi.followUser(debouncedUserId)
                setIsFollowing(true)
            }

            queryClient.invalidateQueries({ queryKey: [`profile:${debouncedUserId}`] })
        } catch (err: unknown) {
            const error = err as Error
            setError(error?.message || (isFollowing ? UserMessage.UNFOLLOW_FAILED : UserMessage.FOLLOW_FAILED))
        } finally {
            setLoading(false)
        }
    }, [debouncedUserId, isAuthenticated, isFollowing, queryClient])

    return {
        toggleFollow,
        loading,
        error,
        isFollowing,
        isAuthenticated
    }
}
