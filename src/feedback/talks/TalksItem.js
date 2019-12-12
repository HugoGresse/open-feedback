import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import connect from 'react-redux/es/connect/connect'
import { getSpeakersListSelector } from '../../core/speakers/speakerSelectors'
import SpeakerList from '../speaker/SpeakerList'
import { getDateFromStartTime } from '../../core/talks/talksUtils'
import { getProjectSelector } from '../project/projectSelectors'

const styles = theme => ({
    itemContainer: {
        margin: -1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '17px',
        boxShadow: 'none',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        border: '1px solid ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#fafafa',
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
})

export const TalksItem = props => {
    const {
        classes,
        talk,
        speakersEntities,
        userVote,
        currentProjectId,
    } = props

    const itemClasses = `${classes.paper} ${
        userVote ? classes.paperSelected : ''
    }`

    const speakers =
        talk.speakers &&
        talk.speakers.map(speakerId => speakersEntities[speakerId])
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
    classes: PropTypes.object.isRequired,
    talk: PropTypes.object.isRequired,
    userVote: PropTypes.object,
}

const mapStateToProps = state => ({
    speakersEntities: getSpeakersListSelector(state),
    currentProjectId: getProjectSelector(state).id,
})

export default connect(mapStateToProps, {})(withStyles(styles)(TalksItem))
