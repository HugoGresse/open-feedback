import React from 'react'
import { useSelector } from 'react-redux'
import { getTalksDatesSelector } from '../../core/talks/talksSelectors'
import {
    getProjectIdSelector,
    getProjectSelectedDateSelector,
} from '../project/projectSelectors'
import { COLORS } from '../../constants/colors'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'

const useStyles = makeStyles({
    menu: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 16,
    },
})

const TalksDateMenu = () => {
    const { t } = useTranslation()
    const talksDates = useSelector(getTalksDatesSelector)
    const selectedDate = useSelector(getProjectSelectedDateSelector)
    const currentProjectId = useSelector(getProjectIdSelector)
    const classes = useStyles()

    if (talksDates.length === 1 && talksDates.includes(TALK_NO_DATE)) {
        return ''
    }

    return (
        <div className={classes.menu}>
            {talksDates.map((date) => (
                <Item
                    key={date}
                    date={date}
                    url={`/${currentProjectId}/${
                        date === TALK_NO_DATE ? '' : date
                    }`}
                    noDateLabel={t('talks.menuNoDate')}
                    isSelected={selectedDate === date}
                />
            ))}
        </div>
    )
}

const useStylesItem = makeStyles((theme) => ({
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

const Item = ({ date, url, isSelected, noDateLabel }) => {
    const classes = useStylesItem({
        isSelected,
    })

    const getDateLabel = (date) => {
        if (date !== TALK_NO_DATE) {
            return DateTime.fromISO(date).toLocaleString({
                weekday: 'long',
                day: 'numeric',
            })
        }
        return noDateLabel
    }

    return (
        <div className={classes.item}>
            <Link to={`${url}`} className={classes.a}>
                {getDateLabel(date)}
            </Link>
        </div>
    )
}

export default TalksDateMenu
