import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getBooleanCountByUser,
    getCommentCountByUser,
    getTotalCommentsSelector,
    getTotalVotersSelector,
    getTotalVotesSelector
} from './dashboardSelectors'
import WhatshotIcon from '@material-ui/icons/WhatshotOutlined'
import DashboardCard from './DashboardCard'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import COLORS from '../../../constants/colors'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { getVoteItems } from '../settings/votingForm/votingFormActions'

const useStyles = makeStyles({
    title: {
        padding: 0
    },
    count: {
        color: COLORS.RED_ORANGE,
        fontSize: 40,
        fontWeight: 'bold'
    }
})

const Highlights = () => {
    const classes = useStyles()
    const voters = useSelector(getTotalVotersSelector)
    const voteCount = useSelector(getTotalVotesSelector)
    const commentCount = useSelector(getTotalCommentsSelector)
    const voteCountByUser = useSelector(getBooleanCountByUser)
    const commentCountByUser = useSelector(getCommentCountByUser)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <DashboardCard title="Highlights" titleIcon={<WhatshotIcon />}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="body1">Total Voters</Typography>
                    <Typography variant="body1" className={classes.count}>
                        {voters}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Votes</Typography>
                    <Typography variant="body1" className={classes.count}>
                        {voteCount}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Comments</Typography>
                    <Typography variant="body1" className={classes.count}>
                        {commentCount}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Vote per user</Typography>
                    <Typography variant="body1" className={classes.count}>
                        {voteCountByUser}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Comments per user</Typography>
                    <Typography variant="body1" className={classes.count}>
                        {commentCountByUser}
                    </Typography>
                </Grid>
            </Grid>
        </DashboardCard>
    )
}

export default Highlights
