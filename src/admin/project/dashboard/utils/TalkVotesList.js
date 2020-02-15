import React, { useState } from 'react'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import DashboardCard from './DashboardCard'
import NoData from './NoData'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../../../constants/colors'
import OFButton from '../../../baseComponents/button/OFButton'
import Typography from '@material-ui/core/Typography'
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

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

const previewCount = 5
const TalkVotesList = ({
    dataArray,
    projectId,
    loading,
    title,
    titleIcon,
    dinoStartDelay,
    countKey,
}) => {
    const classes = useStyles()
    const [selectedIndex, setIndex] = useState(0)

    if (loading) {
        return <LoaderMatchParent />
    }

    const counts = (dataArray && dataArray.length) || 0
    const items =
        dataArray &&
        dataArray.slice(
            selectedIndex * previewCount,
            selectedIndex * previewCount + previewCount
        )
    const hasMore =
        dataArray &&
        dataArray.slice((selectedIndex + 1) * previewCount).length > 0

    return (
        <DashboardCard
            title={title}
            titleIcon={titleIcon}
            rightChildren={
                <Typography component="h2">
                    <OFButton
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                            display:
                                selectedIndex === 0 ? 'none' : 'inline-flex',
                        }}
                        onClick={() => setIndex(selectedIndex - 1)}>
                        <ArrowLeftIcon />
                    </OFButton>
                    {selectedIndex + 1}/{counts / previewCount}
                    <OFButton
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                            display: hasMore ? 'inline-flex' : 'none',
                        }}
                        onClick={() => setIndex(selectedIndex + 1)}>
                        <ArrowRightIcon />
                    </OFButton>
                </Typography>
            }>
            <NoData datas={dataArray} dinoStartDelay={dinoStartDelay}>
                <Grid container spacing={2}>
                    {items.map(row =>
                        getItem(row, projectId, classes, countKey)
                    )}
                </Grid>
            </NoData>
        </DashboardCard>
    )
}

const getItem = (voteWithTalk, projectId, classes, countKey) => {
    return (
        <React.Fragment key={voteWithTalk.talkId}>
            <Grid
                item
                xs={10}
                className={classes.title}
                component="a"
                target="_blank"
                href={`/${projectId}/${voteWithTalk.date}/${voteWithTalk.talkId}`}>
                {voteWithTalk.title}
                <div className={classes.speakers}>
                    {voteWithTalk.speakers
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
                href={`/${projectId}/${voteWithTalk.date}/${voteWithTalk.talkId}`}
                className={classes.count}>
                {voteWithTalk[countKey]}
            </Grid>
        </React.Fragment>
    )
}

export default TalkVotesList
