import { makeStyles } from '@mui/styles'
import { COLORS } from '../../constants/colors'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'
import React from 'react'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles((theme) => ({
    item: {
        transition: 'all 120ms ease-in-out',
        color: (props) =>
            props.isSelected
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
        borderBottom: (props) =>
            `2px ${
                props.isSelected
                    ? COLORS.RED_ORANGE
                    : theme.palette.pageBackground
            } solid`,
        '&:hover': {
            color: COLORS.RED_ORANGE,
        },
    },
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

const DATE_FORMAT = {
    weekday: 'long',
    day: 'numeric',
}
const DATE_FORMAT_LONG = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
}

export const TalkDateMenuItem = ({
    date,
    url,
    isSelected,
    noDateLabel,
    displayFullDates,
}) => {
    const { t } = useTranslation()
    const classes = useStyles({
        isSelected,
    })

    const getDateLabel = (date) => {
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
        <div className={classes.item}>
            <Link
                to={`${url}`}
                className={classes.a}
                title={t('talks.date') + label}
            >
                {label}
            </Link>
        </div>
    )
}

export const TalkDateMenuItemBlank = ({ children }) => {
    const classes = useStyles()

    return <Typography className={classes.blank}>{children}</Typography>
}
