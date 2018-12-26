import React, { Component } from "react"
import { connect } from "react-redux"
import { getSelectedSession, sessionActions } from "./core"
import { getSpeakersList, speakerActions } from "../speaker/core"
import { withStyles } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import config from "../../config"
import Grid from "@material-ui/core/Grid"

import ArrowBack from '@material-ui/icons/ArrowBack'
import Paper from "@material-ui/core/Paper"
import { Link } from "react-router-dom"
import moment from "moment"

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

class SessionVote extends Component {

    componentWillMount() {
        const id = this.props.match.params.sessionId
        this.props.getSession(id)
        this.props.setSelectedSession(id)
        this.props.getSpeakers()
    }

    render() {
        const {classes, speakers, session} = this.props

        if (!session || !speakers) {
            return ''
        }

        return <div>
            <Link to="/"> <ArrowBack/> </Link>

            <Typography variant="h2" id="modal-title">
                {session.title}
            </Typography>

            <Typography variant="h5" id="modal-title">
                {moment(session.startTime).format("dddd D, H:m ")}
                to
                {moment(session.endTime).format(" H:m")}
            </Typography>
            {

                session.speakers.map(speaker =>
                    <Typography variant="h6" key={speaker}>
                        {speakers[speaker] ? speakers[speaker].name : speaker}
                    </Typography>)
            }

            <Grid container className={classes.layout}>
                {config.voteItem.map((vote, key) => (
                    <Grid item key={key} xs={6} sm={4} md={2} className={classes.itemContainer}>
                        <Paper className={classes.paper}>{vote.name}</Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    }
}

const mapStateToProps = state => ({
    session: getSelectedSession(state),
    speakers: getSpeakersList(state),
})

const mapDispatchToProps = Object.assign({}, sessionActions, speakerActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionVote))
