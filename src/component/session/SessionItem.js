import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import connect from 'react-redux/es/connect/connect'
import { getSpeakersList } from '../speaker/core'

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
    color: theme.palette.text.secondary,
    boxShadow: 'none',
    borderRadius: '0',
    borderColor: '#e2e2e2',
    border: '1px solid',
    height: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: '#fafafa'
    }
  }
})

export const SessionItem = props => {
  const { classes, session, speakers, relativeUrl } = props

  const speakerIds = session.speakers

  let speakerRender = ''

  if (speakerIds) {
    speakerRender = session.speakers.map(speakerId => {
      if (speakers[speakerId]) {
        return <p key={speakerId}>{speakers[speakerId].name}</p>
      } else {
        console.log('No speaker for id: ' + speakerId)
        return null
      }
    })
  }

  return (
    <Grid item xs={6} sm={4} md={2} className={classes.itemContainer}>
      <Link to={`${relativeUrl}${session.id}`}>
        <Paper className={classes.paper}>
          {session.title}
          {speakerRender}
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
  speakers: getSpeakersList(state)
})

export default connect(mapStateToProps, {})(withStyles(styles)(SessionItem))
