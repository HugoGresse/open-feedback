import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getVotesByDaySelector } from './dashboardSelectors'
import DashboardCard from './utils/DashboardCard'
import InsertChartOutlined from '@material-ui/icons/InsertChartOutlined'
import NoData from './utils/NoData'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import OFButton from '../../baseComponents/button/OFButton'
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import Typography from '@material-ui/core/Typography'
import { DateTime } from 'luxon'
import VoteTimelineGraph from './VoteTimelineGraph'

const dateFormat = { month: 'long', day: 'numeric', year: 'numeric' }
const VoteTimeline = ({ dinoStartDelay }) => {
    const voteByDay = useSelector(getVotesByDaySelector)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const { t } = useTranslation()

    const voteByDayKeys = Object.keys(voteByDay)

    const changeDate = (newIndex) => {
        if (voteByDayKeys[newIndex] !== undefined) {
            setSelectedIndex(newIndex)
        }
    }

    if (selectedIndex === -1 && voteByDayKeys.length > 0) {
        setSelectedIndex(0)
    }

    const selectedDate = voteByDayKeys[selectedIndex]

    const votes = voteByDay[selectedDate]
    const dateTime = DateTime.fromISO(selectedDate)

    return (
        <DashboardCard
            title={t('dashboard.votesPerHour')}
            titleIcon={<InsertChartOutlined />}
            rightChildren={
                <Typography variant="body1">
                    <OFButton
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                            display:
                                selectedIndex === 0 || !votes
                                    ? 'none'
                                    : 'inline-flex',
                        }}
                        onClick={() => changeDate(selectedIndex - 1)}>
                        <ArrowLeftIcon />
                    </OFButton>
                    {votes && dateTime.toLocaleString(dateFormat)}
                    <OFButton
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                            display:
                                selectedIndex + 1 < voteByDayKeys.length
                                    ? 'inline-flex'
                                    : 'none',
                        }}
                        onClick={() => changeDate(selectedIndex + 1)}>
                        <ArrowRightIcon />
                    </OFButton>
                </Typography>
            }>
            <NoData datas={voteByDayKeys} dinoStartDelay={dinoStartDelay}>
                {votes && (
                    <Box height={300}>
                        <VoteTimelineGraph votes={votes} />
                    </Box>
                )}
            </NoData>
        </DashboardCard>
    )
}

export default VoteTimeline
