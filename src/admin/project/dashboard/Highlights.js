import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getBooleanCountByUser,
    getCommentCountByUser,
    getTotalCommentsSelector,
    getTotalVoterCountSelector,
    getTotalVoteCountSelector,
} from './dashboardSelectors'
import WhatshotIcon from '@material-ui/icons/WhatshotOutlined'
import DashboardCard from './utils/DashboardCard'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import COLORS from '../../../constants/colors'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { getVoteItems } from '../settings/votingForm/votingFormActions'
import NoData from './utils/NoData'

const useStyles = makeStyles({
    count: {
        color: COLORS.RED_ORANGE,
        fontSize: 40,
        fontWeight: 'bold',
    },
})

const Highlights = () => {
    const classes = useStyles()
    const voterCount = useSelector(getTotalVoterCountSelector)
    const voteCount = useSelector(getTotalVoteCountSelector)
    const commentCount = useSelector(getTotalCommentsSelector)
    const voteCountByUser = useSelector(getBooleanCountByUser)
    const commentCountByUser = useSelector(getCommentCountByUser)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <DashboardCard title="Highlights" titleIcon={<WhatshotIcon />}>
            <NoData
                datas={[
                    voterCount,
                    voteCount,
                    commentCount,
                    voteCountByUser,
                    commentCountByUser,
                ]}
                speed={5}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1">Total Voters</Typography>
                        <Typography variant="body1" className={classes.count}>
                            {voterCount}
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
                        <Typography variant="body1">Votes per user</Typography>
                        <Typography variant="body1" className={classes.count}>
                            {voteCountByUser}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            Comments per user
                        </Typography>
                        <Typography variant="body1" className={classes.count}>
                            {commentCountByUser}
                        </Typography>
                    </Grid>
                </Grid>
            </NoData>
        </DashboardCard>
    )
}

export default Highlights
