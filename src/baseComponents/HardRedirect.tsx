import { useEffect } from 'react'

export const HardRedirect = ({ to }) => {
    useEffect(() => {
        if (to) {
            window.location.replace(to)
        }
    }, [to])

    return ''
}
