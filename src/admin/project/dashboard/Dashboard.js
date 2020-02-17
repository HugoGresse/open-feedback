import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getTalkVotes, getUserVotes } from './dashboardActions'
import { getTalks } from '../../../core/talks/talksActions'
import { getProjectSelector } from '../../../feedback/project/projectSelectors'
import { Box, Grid } from '@material-ui/core'
import MostVotedTalks from './MostVotedTalks'
import VoteTimeline from './VoteTimeline'
import Highlights from './Highlights'
import COLORS from '../../../constants/colors'
import { getProject } from '../../../feedback/project/projectActions'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import LeastVotedTalks from './LeastVotedTalks'
import MostCommentedTalks from './MostCommentedTalks'

const Dashboard = () => {
    const dispatch = useDispatch()
    const project = useSelector(getProjectSelector)
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)

    useEffect(() => {
        if (project && selectedProjectId) {
            dispatch(getTalkVotes())
            dispatch(getUserVotes())
            dispatch(getTalks())
            dispatch(getSpeakers())
        } else if (selectedProjectId) {
            dispatch(getProject(selectedProjectId))
        }
    }, [dispatch, project, selectedProjectId])

    if (!project || !selectedProjectId) {
        return <LoaderMatchParent />
    }

    return (
        <Grid container spacing={3}>
            <Box
                bgcolor={COLORS.RED_ORANGE}
                height={180}
                width="100%"
                position="absolute"
                top={0}
                left={0}
            />
            <Grid item xs={12} md={6} lg={4}>
                <Highlights />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <MostVotedTalks dinoStartDelay={2000} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <MostCommentedTalks dinoStartDelay={4000} />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
                <VoteTimeline dinoStartDelay={6000} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <LeastVotedTalks dinoStartDelay={10000} />
            </Grid>
        </Grid>
    )
}

export default Dashboard
