import Box from '@mui/material/Box'
import { DateTime, type DateTimeFormatOptions } from 'luxon'
import { SpeakerList } from '../speaker/SpeakerList.tsx'
import { useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useQuery } from '../../utils/useQuery'
import { useAppSelector } from '../../store'
import {
    getProjectSelector,
    isFullDatesDisplayedSelector,
} from '../project/projectSelectors'
import { QRCodeButton } from '../../baseComponents/QRCodeButton'
import type { Speaker, Talk } from '../../core/models'

const DATE_FORMAT: DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
}

const DATE_FORMAT_LONG: DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}

const formatTalkDateTime = (
    startTime: string,
    endTimeISO: string | null | undefined,
    displayFullDates = false
) => {
    const startDate = DateTime.fromISO(startTime, {
        setZone: true,
    }).toLocaleString(displayFullDates ? DATE_FORMAT_LONG : DATE_FORMAT)

    const startHour = DateTime.fromISO(startTime, { setZone: true })
        .setZone('local', { keepLocalTime: true })
        .toLocaleString(DateTime.TIME_SIMPLE)

    const endTime = endTimeISO
        ? ' - ' +
          DateTime.fromISO(endTimeISO, {
              setZone: true,
          }).toLocaleString(DateTime.TIME_SIMPLE)
        : ''

    return `${startDate} / ${startHour}${endTime}`
}

interface TalkHeaderProps {
    talk: Talk
    speakers: Speaker[]
}

export const TalkHeader = ({ talk, speakers }: TalkHeaderProps) => {
    const theme = useTheme()
    // The talk page is only rendered once the project is loaded
    const project = useAppSelector(getProjectSelector)!
    const hideHeader = useQuery().get('hideHeader')
    const displayFullDates = useAppSelector(isFullDatesDisplayedSelector)

    if (hideHeader && hideHeader === 'true') {
        return <Box height={2}></Box>
    }

    return (
        <Box
            display="flex"
            gap={2}
            marginBottom={4}
            justifyContent="space-between"
            alignItems="flex-start"
        >
            <Box>
                <Typography
                    variant="h2"
                    color="textPrimary"
                    sx={{ wordBreak: 'break-word' }}
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
                    {talk.startTime &&
                        formatTalkDateTime(
                            talk.startTime,
                            talk.endTime,
                            displayFullDates
                        )}
                </Box>
                <SpeakerList speakers={speakers} />
            </Box>
            <QRCodeButton
                url={document.location.href}
                fileName={talk.title.trim() + '-qr-code-openfeedback'}
                logo={project.logoSmall}
                eventColor={
                    project.chipColors ? project.chipColors[0] : undefined
                }
            />
        </Box>
    )
}
