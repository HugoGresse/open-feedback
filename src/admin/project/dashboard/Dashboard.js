import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getTalkVotes, getUserVotes } from './dashboardActions'
import { getTalks } from '../../../core/talks/talksActions'
import { getProject } from '../../../feedback/project/projectActions'
import { getProjectSelector } from '../../../feedback/project/projectSelectors'
import { Grid } from '@material-ui/core'
import { isTalkLoadedSelector } from '../../../core/talks/talksSelectors'
import MostVotedTalks from './MostVotedTalks'
import VoteTimeline from './VoteTimeline'
import Highlights from './Highlights'
import { getVoteItems } from '../settings/votingForm/votingFormActions'

class Dashboard extends Component {
    componentDidMount() {
        this.props.getProject(this.props.selectedProjectId)
        this.props.getUserVotes()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            (!prevProps.project && this.props.project) ||
            prevProps.project.id !== this.props.project.id
        ) {
            this.props.getTalks()
        }

        if (this.props.isTalksLoaded) {
            this.props.getTalkVotes()
            this.props.getVoteItems()
        }
    }

    render() {
        const { project } = this.props

        if (!project) {
            return <LoaderMatchParent />
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Highlights />
                    <MostVotedTalks dinoStartDelay={5000} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <VoteTimeline dinoStartDelay={2600} />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    project: getProjectSelector(state),
    isTalksLoaded: isTalkLoadedSelector(state),
    selectedProjectId: getSelectedProjectIdSelector(state),
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProject: getProject,
        getTalkVotes: getTalkVotes,
        getUserVotes: getUserVotes,
        getTalks: getTalks,
        getVoteItems: getVoteItems,
    }
)
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
