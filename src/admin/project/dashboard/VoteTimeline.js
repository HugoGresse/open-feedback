import React from 'react'
import { useSelector } from 'react-redux'
import { getVotesByHourSelector } from './dashboardSelectors'
import CircularProgress from '@material-ui/core/CircularProgress'
import XAxis from 'recharts/es6/cartesian/XAxis'
import YAxis from 'recharts/es6/cartesian/YAxis'
import Tooltip from 'recharts/es6/component/Tooltip'
import AreaChart from 'recharts/es6/chart/AreaChart'
import Area from 'recharts/es6/cartesian/Area'
import ResponsiveContainer from 'recharts/es6/component/ResponsiveContainer'
import DashboardCard from './utils/DashboardCard'
import InsertChartOutlined from '@material-ui/icons/InsertChartOutlined'
import NoData from './utils/NoData'
import { useTranslation } from 'react-i18next'

const VoteTimeline = ({ dinoStartDelay }) => {
    const votesByHour = useSelector(getVotesByHourSelector)
    const { t } = useTranslation()

    if (!votesByHour) {
        return <CircularProgress />
    }

    return (
        <DashboardCard
            title={t('dashboard.votesPerHour')}
            titleIcon={<InsertChartOutlined />}>
            <NoData datas={votesByHour} dinoStartDelay={dinoStartDelay}>
                <ResponsiveContainer height={250} width="80%">
                    <AreaChart data={votesByHour} strokeWidth={2}>
                        <defs>
                            <linearGradient
                                id="gradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#8884d8"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#8884d8"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorPv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#82ca9d"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#82ca9d"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="voteCount"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#gradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </NoData>
        </DashboardCard>
    )
}

export default VoteTimeline
