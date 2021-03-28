import makeStyles from '@material-ui/core/styles/makeStyles'
import { COLORS } from '../../constants/colors'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    item: {
        color: (props) =>
            props.isSelected
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
        borderBottom: (props) =>
            props.isSelected ? `2px ${COLORS.RED_ORANGE} solid` : 'none',
        '&:hover': {
            color: COLORS.RED_ORANGE,
        },
    },
    a: {
        padding: 10,
        color: 'inherit',
        display: 'block',
    },
}))

const DATE_FORMAT = {
    weekday: 'long',
    day: 'numeric',
}

export const TalkDateMenuItem = ({ date, url, isSelected, noDateLabel }) => {
    const { t } = useTranslation()
    const classes = useStyles({
        isSelected,
    })

    const getDateLabel = (date) => {
        if (date !== TALK_NO_DATE) {
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
                title={t('talks.date') + label}>
                {label}
            </Link>
        </div>
    )
}
