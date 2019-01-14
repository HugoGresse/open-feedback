import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import connect from 'react-redux/es/connect/connect'
import { getSpeakersList } from '../speaker/core'
import SpeakerList from '../speaker/SpeakerList'

const styles = theme => ({
    itemContainer: {
        margin: -1,
        '&:hover': {
            cursor: 'pointer'
        }
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        fontSize: '17px',
        boxShadow: 'none',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        border: '1px solid ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#fafafa'
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 200ms ease-out'
    }
})

export const SessionItem = props => {
    const { classes, session, speakersEntities, routerParams } = props

    const speakers =
        session.speakers &&
        session.speakers.map(speakerId => speakersEntities[speakerId])

    return (
        <Grid item xs={6} sm={4} md={4} className={classes.itemContainer}>
            <Link to={`/${routerParams.projectId}/${session.id}`}>
                <Paper className={classes.paper}>
                    {session.title}
                    {speakers && (
                        <SpeakerList speakers={speakers} size="small" />
                    )}
                </Paper>
            </Link>
        </Grid>
    )
}

SessionItem.propTypes = {
    classes: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    speakersEntities: getSpeakersList(state)
})

export default connect(
    mapStateToProps,
    {}
)(withStyles(styles)(SessionItem))
