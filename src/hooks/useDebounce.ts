import { useState, useEffect } from 'react'
interface props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
    delay: number
}
function useDebounce({ value, delay }: props) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

export default useDebounce
