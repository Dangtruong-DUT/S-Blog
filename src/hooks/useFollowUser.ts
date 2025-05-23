import { useCallback, useState } from 'react'
import userApi from 'src/apis/user.api'
import useDebounce from 'src/hooks/useDebounce'

export function useFollowUser(userId: string, delay = 400) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean | null>(null)

    // Debounce userId to avoid rapid calls
    const debouncedUserId = useDebounce({ value: userId, delay })

    const follow = useCallback(async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            await userApi.followUser(debouncedUserId)
            setSuccess(true)
        } catch (err: any) {
            setError(err?.message || 'Follow failed')
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }, [debouncedUserId])

    return { follow, loading, error, success }
}

export function useUnfollowUser(userId: string, delay = 400) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean | null>(null)

    // Debounce userId to avoid rapid calls
    const debouncedUserId = useDebounce({ value: userId, delay })

    const unfollow = useCallback(async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            await userApi.unFollowUser(debouncedUserId)
            setSuccess(true)
        } catch (err: any) {
            setError(err?.message || 'Unfollow failed')
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }, [debouncedUserId])

    return { unfollow, loading, error, success }
}
