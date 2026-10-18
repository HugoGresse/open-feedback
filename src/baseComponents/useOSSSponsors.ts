import { useEffect, useState } from 'react'
import { OpenSponsorsUrl } from '../env.ts'

export interface OSSSponsor {
    name: string
    website: string
    logo: string
    logoDark: string
    tracking: string
}

export const useOSSSponsors = () => {
    const [sponsors, setSponsors] = useState<OSSSponsor[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!OpenSponsorsUrl) {
                throw new Error('VITE_OPEN_SPONSORS is not set')
            }
            const response = await fetch(OpenSponsorsUrl)
            // JSON boundary
            const data = (await response.json()) as {
                sponsors?: OSSSponsor[]
            }
            setSponsors(data.sponsors || [])
        }
        fetchData().catch(console.error)
    }, [])

    return sponsors
}
