import { useEffect } from 'react'

export const HardRedirect = ({ to }: { to?: string | null }) => {
    useEffect(() => {
        if (to) {
            window.location.replace(to)
        }
    }, [to])

    return ''
}
