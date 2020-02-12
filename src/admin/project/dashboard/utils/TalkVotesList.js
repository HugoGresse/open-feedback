import React from 'react'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import DashboardCard from './DashboardCard'
import NoData from './NoData'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../../../constants/colors'

const useStyles = makeStyles({
    title: {
        padding: 0,
        color: 'black',
        '&:hover': {
            color: COLORS.DARK_RED_ORANGE,
        },
    },
    count: {
        color: COLORS.RED_ORANGE,
        fontSize: 16,
        fontWeight: 'bold',
        '&:hover': {
            color: COLORS.DARK_RED_ORANGE,
        },
    },
    speakers: {
        color: COLORS.LIGHT_GRAY,
    },
})

const TalkVotesList = ({
    dataArray,
    projectId,
    loading,
    title,
    titleIcon,
    dinoStartDelay,
}) => {
    const classes = useStyles()

    if (loading) {
        return <LoaderMatchParent />
    }

    return (
        <DashboardCard title={title} titleIcon={titleIcon}>
            <NoData datas={dataArray} dinoStartDelay={dinoStartDelay}>
                <Grid container spacing={2}>
                    {dataArray.map(row => (
                        <React.Fragment key={row.talkId}>
                            <Grid
                                item
                                xs={10}
                                className={classes.title}
                                component="a"
                                target="_blank"
                                href={`/${projectId}/${row.date}/${row.talkId}`}>
                                {row.title}
                                <div className={classes.speakers}>
                                    {row.speakers
                                        .map(speaker => speaker && speaker.name)
                                        .join(', ')}
                                </div>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                component="a"
                                target="_blank"
                                align="right"
                                href={`/${projectId}/${row.date}/${row.talkId}`}
                                className={classes.count}>
                                {row.voteCount}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </NoData>
        </DashboardCard>
    )
}

export default TalkVotesList
