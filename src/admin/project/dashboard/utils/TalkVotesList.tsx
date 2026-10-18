import { useState } from 'react'
import { LoaderMatchParent } from '../../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { DashboardCard } from './DashboardCard.tsx'
import { NoData } from './NoData.tsx'
import Grid from '@mui/material/Grid'
import { HEX_COLORS } from '../../../../constants/colors'
import { OFButton } from '../../../baseComponents/button/OFButton.tsx'
import Typography from '@mui/material/Typography'
import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { makeStyles } from '@mui/styles'
import type { ReactNode } from 'react'
import type { TalkWithVotes } from '../dashboardSelectors'

const useStyles = makeStyles({
    title: {
        padding: 0,
        color: 'black',
        '&:hover': {
            color: HEX_COLORS.DARK_RED_ORANGE,
        },
        '& span': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkit-line-clamp': 4,
            '-webkit-box-orient': 'vertical',
        },
    },
    count: {
        color: HEX_COLORS.RED_ORANGE,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 'bold',
        '&:hover': {
            color: HEX_COLORS.DARK_RED_ORANGE,
        },
    },
    speakers: {
        color: HEX_COLORS.LIGHT_GRAY,
    },
})

type TalkVotesListClasses = ReturnType<typeof useStyles>

export interface TalkVotesListProps {
    dataArray: TalkWithVotes[]
    projectId: string | null
    loading: boolean
    title: string
    titleIcon: ReactNode
    dinoStartDelay?: number
    countKey: 'voteCount' | 'commentCount'
}

const previewCount = 5
export const TalkVotesList = ({
    dataArray,
    projectId,
    loading,
    title,
    titleIcon,
    dinoStartDelay,
    countKey,
}: TalkVotesListProps) => {
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
    const numberOfPages = Math.ceil(counts / previewCount)

    return (
        <DashboardCard
            title={title}
            titleIcon={titleIcon}
            rightChildren={
                <Typography variant="body1">
                    <OFButton
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                            display:
                                selectedIndex === 0 ? 'none' : 'inline-flex',
                        }}
                        onClick={() => setIndex(selectedIndex - 1)}
                    >
                        <ArrowLeftIcon />
                    </OFButton>
                    {numberOfPages > 1 && (
                        <span>
                            {selectedIndex + 1}/{numberOfPages}
                        </span>
                    )}
                    <OFButton
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                            display: hasMore ? 'inline-flex' : 'none',
                        }}
                        onClick={() => setIndex(selectedIndex + 1)}
                    >
                        <ArrowRightIcon />
                    </OFButton>
                </Typography>
            }
        >
            <NoData datas={dataArray} dinoStartDelay={dinoStartDelay}>
                <Grid container spacing={2} component="ul">
                    {items.map((row) =>
                        getItem(row, projectId, classes, countKey)
                    )}
                </Grid>
            </NoData>
        </DashboardCard>
    )
}

const getItem = (
    voteWithTalk: TalkWithVotes,
    projectId: string | null,
    classes: TalkVotesListClasses,
    countKey: TalkVotesListProps['countKey']
) => {
    return (
        <Grid item xs={12} component="li" key={voteWithTalk.talkId}>
            <Grid container>
                <Grid
                    item
                    xs={10}
                    className={classes.title}
                    component="a"
                    target="_blank"
                    href={`/${projectId}/${voteWithTalk.date}/${voteWithTalk.talkId}`}
                >
                    <span>{voteWithTalk.title}</span>
                    <div className={classes.speakers}>
                        {voteWithTalk.speakers
                            .map((speaker) => speaker && speaker.name)
                            .join(', ')}
                    </div>
                </Grid>
                <Grid
                    item
                    xs={2}
                    component="a"
                    target="_blank"
                    href={`/${projectId}/${voteWithTalk.date}/${voteWithTalk.talkId}`}
                    className={classes.count}
                >
                    {voteWithTalk[countKey]}
                </Grid>
            </Grid>
        </Grid>
    )
}
