import React from 'react'
import { useSelector } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getMostVotedSessionSelector } from './dashboardSelectors'
import ThumbsUpIcon from '@material-ui/icons/ThumbUpSharp'
import DashboardCard from './DashboardCard'
import Grid from '@material-ui/core/Grid'
import COLORS from '../../../constants/colors'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'

const useStyles = makeStyles({
    title: {
        padding: 0
    },
    count: {
        color: COLORS.RED_ORANGE,
        fontSize: 16,
        fontWeight: 'bold'
    }
})

const MostVotedSessions = () => {
    const classes = useStyles()
    const mostVotedSessions = useSelector(getMostVotedSessionSelector)
    const projectId = useSelector(getSelectedProjectIdSelector)

    if (!mostVotedSessions) {
        return <LoaderMatchParent />
    }

    return (
        <DashboardCard title="Most voted" titleIcon={<ThumbsUpIcon />}>
            <Grid container spacing={2}>
                {mostVotedSessions.map(row => (
                    <React.Fragment key={row.sessionId}>
                        <Grid
                            item
                            xs={10}
                            className={classes.title}
                            component="a"
                            target="_blank"
                            style={{ color: '#000' }}
                            href={`/${projectId}/${row.date}/${row.sessionId}`}
                        >
                            {row.title}
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            component="a"
                            target="_blank"
                            align="right"
                            href={`/${projectId}/${row.date}/${row.sessionId}`}
                            className={classes.count}
                        >
                            {row.voteCount}
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </DashboardCard>
    )
}

export default MostVotedSessions
