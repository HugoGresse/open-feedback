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

const useStyles = makeStyles({
    menu: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 10,
    },
})

const TalksDateMenu = () => {
    const talksDates = useSelector(getTalksDatesSelector)
    const selectedDate = useSelector(getProjectSelectedDateSelector)
    const currentProjectId = useSelector(getProjectIdSelector)

    const classes = useStyles()

    return (
        <div className={classes.menu}>
            {talksDates.map(date => (
                <Item
                    key={date}
                    date={date}
                    url={`/${currentProjectId}/${date}`}
                    isSelected={selectedDate === date}
                />
            ))}
        </div>
    )
}

const useStylesItem = makeStyles(theme => ({
    item: {
        color: props =>
            props.isSelected
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
        borderBottom: props =>
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

const Item = ({ date, url, isSelected }) => {
    const classes = useStylesItem({
        isSelected,
    })

    return (
        <div className={classes.item}>
            <Link to={`${url}`} className={classes.a}>
                {DateTime.fromISO(date).toLocaleString({
                    weekday: 'long',
                    day: 'numeric',
                })}
            </Link>
        </div>
    )
}

export default TalksDateMenu
