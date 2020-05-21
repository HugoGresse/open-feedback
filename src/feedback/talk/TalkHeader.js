import React from 'react'
import Box from '@material-ui/core/Box'
import Title from '../layout/Title'
import { COLORS } from '../../constants/colors'
import { DateTime } from 'luxon'
import SpeakerList from '../speaker/SpeakerList'

const formatTalkDateTime = (talk) => {
    const startDate = DateTime.fromISO(talk.startTime, {
        setZone: true,
    }).toLocaleString({
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })

    const startTime = DateTime.fromISO(talk.startTime, { setZone: true })
        .setZone('local', { keepLocalTime: true })
        .toLocaleString(DateTime.TIME_SIMPLE)

    const endTime = DateTime.fromISO(talk.endTime, {
        setZone: true,
    }).toLocaleString(DateTime.TIME_SIMPLE)

    return `${startDate} / ${startTime} - ${endTime}`
}

const TalkHeader = ({ talk, speakers }) => {
    return (
        <Box marginBottom={4}>
            <Title variant="h2" color="textPrimary">
                {talk.title}
                <Box
                    color={COLORS.GRAY}
                    fontSize={20}
                    marginLeft={1}
                    component="span">
                    {talk.tags &&
                        talk.tags.map((tag, key) => (
                            <span key={key}>#{tag} </span>
                        ))}
                </Box>
            </Title>
            <Box fontSize={16} color={COLORS.GRAY} marginBottom={2}>
                {talk.startTime && formatTalkDateTime(talk)}
            </Box>
            <SpeakerList speakers={speakers} />
        </Box>
    )
}

export default TalkHeader
