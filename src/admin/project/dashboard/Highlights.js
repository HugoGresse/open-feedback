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
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../baseComponents/TranslatedTypography'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'

const useStyles = makeStyles({
    count: {
        color: COLORS.RED_ORANGE,
        fontSize: 40,
        fontWeight: 'bold',
    },
})

const Highlights = () => {
    const classes = useStyles()
    const projectId = useSelector(getSelectedProjectIdSelector)
    const voterCount = useSelector(getTotalVoterCountSelector)
    const voteCount = useSelector(getTotalVoteCountSelector)
    const commentCount = useSelector(getTotalCommentsSelector)
    const voteCountByUser = useSelector(getBooleanCountByUser)
    const commentCountByUser = useSelector(getCommentCountByUser)
    const { t } = useTranslation()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch, projectId])

    return (
        <DashboardCard
            title={t('dashboard.highlights')}
            titleIcon={<WhatshotIcon />}>
            <NoData
                datas={[
                    voterCount,
                    voteCount,
                    commentCount,
                    voteCountByUser,
                    commentCountByUser,
                ]}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TranslatedTypography variant="body1">
                            dashboard.totalVoters
                        </TranslatedTypography>
                        <Typography variant="body1" className={classes.count}>
                            {voterCount}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TranslatedTypography variant="body1">
                            dashboard.votes
                        </TranslatedTypography>
                        <Typography variant="body1" className={classes.count}>
                            {voteCount}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TranslatedTypography variant="body1">
                            dashboard.comments
                        </TranslatedTypography>
                        <Typography variant="body1" className={classes.count}>
                            {commentCount}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TranslatedTypography variant="body1">
                            dashboard.votesPerUser
                        </TranslatedTypography>
                        <Typography variant="body1" className={classes.count}>
                            {voteCountByUser}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TranslatedTypography variant="body1">
                            dashboard.commentsPerUser
                        </TranslatedTypography>
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
