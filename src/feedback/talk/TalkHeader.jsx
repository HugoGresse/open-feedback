import React from 'react'
import Box from '@mui/material/Box'
import { DateTime } from 'luxon'
import SpeakerList from '../speaker/SpeakerList.jsx'
import { useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import useQuery from '../../utils/useQuery'
import { useSelector } from 'react-redux'
import { isFullDatesDisplayedSelector } from '../project/projectSelectors'

const DATE_FORMAT = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
}

const DATE_FORMAT_LONG = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}

const formatTalkDateTime = (talk, displayFullDates = false) => {
    const startDate = DateTime.fromISO(talk.startTime, {
        setZone: true,
    }).toLocaleString(displayFullDates ? DATE_FORMAT_LONG : DATE_FORMAT)

    const startTime = DateTime.fromISO(talk.startTime, { setZone: true })
        .setZone('local', { keepLocalTime: true })
        .toLocaleString(DateTime.TIME_SIMPLE)

    const endTime = talk.endTime
        ? ' - ' +
          DateTime.fromISO(talk.endTime, {
              setZone: true,
          }).toLocaleString(DateTime.TIME_SIMPLE)
        : ''

    return `${startDate} / ${startTime}${endTime}`
}


export const TalkHeader = ({ talk, speakers }) => {
    const theme = useTheme()
    const hideHeader = useQuery().get('hideHeader')
    const displayFullDates = useSelector(isFullDatesDisplayedSelector)

    if (hideHeader && hideHeader === 'true') {
        return <Box height={2}></Box>
    }

    return (
        <Box marginBottom={4}>
            <Typography
                variant="h2"
                color="textPrimary"
                sx={{wordBreak: 'break-word'}}
            >
                {talk.title}
                <Box
                    color={theme.palette.textDimmed}
                    fontSize={20}
                    marginLeft={1}
                    component="span"
                >
                    {talk.tags &&
                        talk.tags.map((tag, key) => (
                            <span key={key}>#{tag} </span>
                        ))}
                </Box>
            </Typography>
            <Box
                fontSize={16}
                color={theme.palette.textDimmed}
                marginBottom={2}
            >
                {talk.startTime && formatTalkDateTime(talk, displayFullDates)}
            </Box>
            <SpeakerList speakers={speakers} />
        </Box>
    )
}
