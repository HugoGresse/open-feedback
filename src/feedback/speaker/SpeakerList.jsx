import React from 'react'
import SpeakerItem from './SpeakerItem.jsx'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    speakers: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxHeight: (props) => (props.isSmall ? 58 : 'none'),
    },
    exceeding: {
        fontSize: '12px',
    },
}))

const MAX_DISPLAYED_SPEAKERS = 3
export const SIZE_SMALL = 'small'
export const SIZE_MEDIUM = 'medium'
const SpeakerList = ({ speakers, size = SIZE_MEDIUM }) => {
    const isSmall = size === SIZE_SMALL
    const classes = useStyles({
        isSmall: isSmall,
    })
    const { t } = useTranslation()
    const displayedSpeakers = isSmall
        ? speakers.slice(0, MAX_DISPLAYED_SPEAKERS)
        : speakers
    const exceedingSpeakersCount = speakers.length - displayedSpeakers.length
    const exceedingMessage =
        exceedingSpeakersCount > 1 ? t('speakers') : t('speaker')

    return (
        <div className={classes.speakers}>
            {displayedSpeakers.map((speaker, key) => (
                <SpeakerItem key={key} {...speaker} size={size} />
            ))}
            {exceedingSpeakersCount > 0 && (
                <Typography className={classes.exceeding}>
                    + {exceedingSpeakersCount} {exceedingMessage}
                </Typography>
            )}
        </div>
    )
}

export default SpeakerList
