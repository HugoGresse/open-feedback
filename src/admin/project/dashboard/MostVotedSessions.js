import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getMostVotedSessionSelector } from './dashboardSelectors'
import withStyles from '@material-ui/core/styles/withStyles'
import WhatshotIcon from '@material-ui/icons/WhatshotOutlined'
import DashboardCard from '../../baseComponents/DashboardCard'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import COLORS from '../../../constants/colors'

const styles = () => ({
    title: {
        padding: 0
    },
    count: {
        color: COLORS.RED_ORANGE,
        fontSize: 16,
        fontWeight: 'bold'
    }
})

class MostVotedSessions extends Component {
    render() {
        const { mostVotedSessions, classes } = this.props

        if (!mostVotedSessions) {
            return <LoaderMatchParent />
        }

        return (
            <DashboardCard title="Most voted" titleIcon={<WhatshotIcon />}>
                <Grid container spacing={2}>
                    {mostVotedSessions.map(row => (
                        <React.Fragment key={row.sessionId}>
                            <Grid item xs={10} className={classes.title}>
                                <Typography variant="body1">
                                    {row.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography
                                    align="right"
                                    className={classes.count}
                                >
                                    {row.voteCount}
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </DashboardCard>
        )
    }
}

const mapStateToProps = state => ({
    mostVotedSessions: getMostVotedSessionSelector(state)
})

export default connect(
    mapStateToProps,
    {}
)(withStyles(styles)(MostVotedSessions))
