import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getBooleanCountByUser,
    getCommentCountByUser,
    getTotalCommentsSelector,
    getTotalVoterCountSelector,
    getTotalVoteCountSelector,
} from './dashboardSelectors'
import WhatshotIcon from '@mui/icons-material/WhatshotOutlined'
import { DashboardCard } from './utils/DashboardCard.tsx'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { HEX_COLORS } from '../../../constants/colors'
import { getVoteItems } from '../settings/votingForm/votingFormActions.tsx'
import { NoData } from './utils/NoData.tsx'
import { useTranslation } from 'react-i18next'
import { TranslatedTypography } from '../../baseComponents/TranslatedTypography.tsx'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    count: {
        color: HEX_COLORS.RED_ORANGE,
        fontSize: 40,
        fontWeight: 'bold',
    },
})

export const Highlights = () => {
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
            titleIcon={<WhatshotIcon />}
        >
            <NoData
                datas={[
                    voterCount,
                    voteCount,
                    commentCount,
                    voteCountByUser,
                    commentCountByUser,
                ]}
            >
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
