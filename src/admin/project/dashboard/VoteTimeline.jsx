import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getVotesByDaySelector } from './dashboardSelectors'
import DashboardCard from './utils/DashboardCard.jsx'
import InsertChartOutlined from '@mui/icons-material/InsertChartOutlined'
import NoData from './utils/NoData.jsx'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Typography from '@mui/material/Typography'
import { DateTime } from 'luxon'
import VoteTimelineGraph from './VoteTimelineGraph.jsx'

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
                    {votes && dateTime.toLocaleString(dateFormat)}
                    <OFButton
                        disabled={selectedIndex === 0 || !votes}
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
                        }}
                        onClick={() => changeDate(selectedIndex - 1)}>
                        <ArrowLeftIcon />
                    </OFButton>
                    <OFButton
                        disabled={selectedIndex + 1 >= voteByDayKeys.length}
                        style={{
                            design: 'text',
                            minWidth: '20px',
                            marginTop: -2,
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
