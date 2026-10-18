import { makeStyles } from '@mui/styles'
import { COLORS } from '../../constants/colors'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'
import { DateTime, type DateTimeFormatOptions } from 'luxon'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import type { ReactNode } from 'react'

const useStyles = makeStyles(() => ({
    a: {
        padding: 10,
        color: 'inherit',
        display: 'block',
    },
    blank: {
        padding: 10,
        fontSize: 25,
        lineHeight: '0.6em',
    },
}))

const DATE_FORMAT: DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
}
const DATE_FORMAT_LONG: DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
}

interface TalkDateMenuItemProps {
    /** yyyy-MM-dd or TALK_NO_DATE */
    date: string
    url: string
    isSelected: boolean
    noDateLabel: string
    displayFullDates?: boolean
}

export const TalkDateMenuItem = ({
    date,
    url,
    isSelected,
    noDateLabel,
    displayFullDates,
}: TalkDateMenuItemProps) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const classes = useStyles({
        isSelected,
    })

    const getDateLabel = (date: string) => {
        if (date !== TALK_NO_DATE) {
            if (displayFullDates) {
                return DateTime.fromISO(date).toLocaleString(DATE_FORMAT_LONG)
            }
            return DateTime.fromISO(date).toLocaleString(DATE_FORMAT)
        }
        return noDateLabel
    }

    const label = getDateLabel(date)

    return (
        <Box
            sx={{
                transition: 'all 120ms ease-in-out',
                color: isSelected
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                borderBottom: `2px ${
                    isSelected
                        ? COLORS.RED_ORANGE
                        : theme.palette.pageBackground
                } solid`,
                '&:hover': {
                    color: COLORS.RED_ORANGE,
                },
            }}
        >
            <Link
                to={`${url}`}
                className={classes.a}
                title={t('talks.date') + label}
            >
                {label}
            </Link>
        </Box>
    )
}

interface TalkDateMenuItemBlankProps {
    children?: ReactNode
}

export const TalkDateMenuItemBlank = ({
    children,
}: TalkDateMenuItemBlankProps) => {
    const classes = useStyles()

    return <Typography className={classes.blank}>{children}</Typography>
}
