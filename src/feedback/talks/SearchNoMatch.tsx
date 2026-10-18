import { useAppSelector } from '../../store'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { getProjectSelectedDateSelector } from '../project/projectSelectors'

interface SearchNoMatchProps {
    /** Some talks of other dates match the search. */
    otherMatch: boolean
}

export const SearchNoMatch = ({ otherMatch }: SearchNoMatchProps) => {
    const { t } = useTranslation()
    const selectedDate = useAppSelector(getProjectSelectedDateSelector)

    return (
        <Typography color="textPrimary">
            {t(otherMatch ? 'searchNoMatch' : 'searchNoMatchAtAll')}{' '}
            {otherMatch &&
                DateTime.fromISO(selectedDate, {
                    setZone: true,
                }).toLocaleString({
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                }) + '.'}
        </Typography>
    )
}
