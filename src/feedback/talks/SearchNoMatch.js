import React from 'react'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { getProjectSelectedDateSelector } from '../project/projectSelectors'

const SearchNoMatch = ({ otherMatch }) => {
    const { t } = useTranslation()
    const selectedDate = useSelector(getProjectSelectedDateSelector)

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

export default SearchNoMatch
