import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import { getSpeakersListSelector } from '../../core/speakers/speakerSelectors'
import SpeakerList from '../speaker/SpeakerList'
import { getDateFromStartTime } from '../../core/talks/talksUtils'
import { getProjectIdSelector } from '../project/projectSelectors'
import { darken, lighten } from '@material-ui/core'
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
    itemContainer: {
        margin: -1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '17px',
        boxShadow: 'none',
        borderRadius: '0',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        border: '1px solid ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor:
                theme.palette.type === 'dark'
                    ? lighten(theme.palette.background.default, 0.2)
                    : darken(theme.palette.background.default, 0.05),
            cursor: 'pointer',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 200ms ease-out',
    },
    paperSelected: {
        opacity: 0.5,
    },
    a: {
        display: 'block',
    },
}))

export const TalksItem = ({ talk, userVote }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const speakersEntities = useSelector(getSpeakersListSelector)
    const currentProjectId = useSelector(getProjectIdSelector)
    const itemClasses = `${classes.paper} ${
        userVote ? classes.paperSelected : ''
    }`

    const speakers =
        talk.speakers &&
        talk.speakers.map((speakerId) => speakersEntities[speakerId])
    const date = getDateFromStartTime(talk.startTime)
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            className={`${classes.itemContainer} talk`}>
            <Link
                to={`/${currentProjectId}/${date}/${talk.id}`}
                title={t('talks.vote') + talk.title}
                className={classes.a}>
                <Paper className={itemClasses}>
                    {talk.title}
                    {speakers && (
                        <SpeakerList speakers={speakers} size="small" />
                    )}
                </Paper>
            </Link>
        </Grid>
    )
}

TalksItem.propTypes = {
    talk: PropTypes.object.isRequired,
    userVote: PropTypes.object,
}

export default TalksItem
