import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { getTalkVotes, getUserVotes } from './dashboardActions'
import { getTalks } from '../../../core/talks/talksActions'
import { getProjectSelector } from '../../../feedback/project/projectSelectors'
import { Box, Grid } from '@mui/material'
import { MostVotedTalks } from './MostVotedTalks.tsx'
import { VoteTimeline } from './VoteTimeline.tsx'
import { Highlights } from './Highlights.tsx'
import { HEX_COLORS } from '../../../constants/colors'
import { getProject } from '../../../feedback/project/projectActions'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import { LeastVotedTalks } from './LeastVotedTalks.tsx'
import { MostCommentedTalks } from './MostCommentedTalks.tsx'

export const Dashboard = () => {
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
                bgcolor={HEX_COLORS.RED_ORANGE}
                height={180}
                width="100%"
                position="absolute"
                top={0}
                left={0}
            />
            <Grid item xs={12} md={6} lg={4}>
                <Highlights />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
                <VoteTimeline dinoStartDelay={6000} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <MostVotedTalks dinoStartDelay={2000} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <MostCommentedTalks dinoStartDelay={4000} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <LeastVotedTalks dinoStartDelay={10000} />
            </Grid>
        </Grid>
    )
}
