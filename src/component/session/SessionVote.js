import React, { Component } from "react"
import { connect } from "react-redux"
import { getSelectedSession, sessionActions } from "./core"
import { withStyles } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import config from "../../config"
import Grid from "@material-ui/core/Grid"

import ArrowBack from '@material-ui/icons/ArrowBack'
import Paper from "@material-ui/core/Paper"
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon"
import { Link } from "react-router-dom"

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
    }

    render() {
        const {classes, session} = this.props

        if (!session) {
            return ''
        }

        return <div>

            <Link to="/"> <ArrowBack/> </Link>


            <Typography variant="h2" id="modal-title">
                {session.title}
            </Typography>
            {
                session.speakers.map(speaker =>
                    <Typography variant="h6" id="modal-title">
                        {speaker}
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
    session: getSelectedSession(state)
})

const mapDispatchToProps = Object.assign({}, sessionActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SessionVote))
