import { SpeakerItem } from './SpeakerItem.tsx'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import type { Speaker } from '../../core/models'

interface SpeakerListStyleProps {
    isSmall: boolean
}
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    speakers: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxHeight: (props: SpeakerListStyleProps) =>
            props.isSmall ? 58 : 'none',
    },
    exceeding: {
        fontSize: '12px',
    },
}))

const MAX_DISPLAYED_SPEAKERS = 3
export const SIZE_SMALL = 'small'
export const SIZE_MEDIUM = 'medium'
export type SpeakerSize = typeof SIZE_SMALL | typeof SIZE_MEDIUM

interface SpeakerListProps {
    speakers: Speaker[]
    size?: SpeakerSize
}

export const SpeakerList = ({
    speakers,
    size = SIZE_MEDIUM,
}: SpeakerListProps) => {
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
