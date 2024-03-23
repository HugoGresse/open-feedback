import { useEffect } from 'react'

const HardRedirect = ({ to }) => {
    useEffect(() => {
        if (to) {
            window.location.replace(to)
        }
    }, [to])

    return ''
}

export default HardRedirect
