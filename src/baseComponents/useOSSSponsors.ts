import { useEffect, useState } from 'react'
import { OpenSponsorsUrl } from '../env.ts'

export const useOSSSponsors = () => {
    const [sponsors, setSponsors] = useState<
        {
            name: string
            website: string
            logo: string
            logoDark: string
            tracking: string
        }[]
    >([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(OpenSponsorsUrl)
            const data = await response.json()
            setSponsors(data.sponsors || [])
        }
        fetchData().catch(console.error)
    }, [])

    return sponsors
}
