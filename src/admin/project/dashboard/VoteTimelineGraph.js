import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { useTheme } from '@nivo/core'
import COLORS from '../../../constants/colors'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import useThemeMui from '@material-ui/core/styles/useTheme'

const VoteTimelineGraph = ({ votes }) => {
    const theme = useThemeMui()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <ResponsiveLine
            data={[
                {
                    id: '',
                    data: votes,
                },
            ]}
            margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
            lineWidth={4}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear' }}
            sliceTooltip={Tooltip}
            axisBottom={{
                orient: 'bottom',
                tickValues: 10,
                renderTick: HorizontalTick(isMobile ? 2 : 100),
            }}
            axisLeft={{
                orient: 'left',
                tickValues: 4,
                renderTick: VerticalTick,
            }}
            enablePoints={false}
            enableGridX={false}
            enableSlices="x"
            useMesh={true}
            colors={COLORS.RED_ORANGE}
            motionStiffness={300}
            motionDamping={40}
        />
    )
}

const VerticalTick = tick => {
    const theme = useTheme()

    // Hide first tick at 0, 0
    if (tick.tickIndex === 0) {
        return null
    }

    return (
        <g
            transform={`translate(${tick.x},${tick.y + 8})`}
            opacity={tick.opacity}>
            <text
                textAnchor="left"
                dominantBaseline="middle"
                style={{
                    ...theme.axis.ticks.text,
                    fill: '#888',
                    fontSize: 12,
                }}>
                {tick.value}
            </text>
        </g>
    )
}

const HorizontalTick = pointToDisplay => tick => {
    // Hide first tick at 0, 0
    if (tick.tickIndex === 0) {
        return null
    }

    let opacity = tick.opacity
    if (parseInt(tick.value) % pointToDisplay === 0) {
        opacity = 0
    }

    return (
        <g opacity={opacity} transform={`translate(${tick.x},${tick.y})`}>
            <line stroke="#ccc" strokeWidth={1} y1={0} y2={7} />
            <g transform={`translate(0,${tick.y + 16})`}>
                <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                        fill: '#888',
                        fontSize: 12,
                    }}>
                    {tick.value}
                </text>
            </g>
        </g>
    )
}

const Tooltip = ({ slice }) => {
    return (
        <div
            style={{
                padding: 5,
                borderRadius: 5,
                boxShadow: '0 1px 4px #999',
                backgroundColor: '#FFF',
                maxWidth: '40vw',
            }}>
            {slice.points.map(point => (
                <div
                    key={point.id}
                    style={{
                        color: point.serieColor,
                    }}>
                    <strong>{point.data.yFormatted} vote(s)</strong> <br />
                    {point.data.dateTime.toLocaleString({
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    })}
                </div>
            ))}
        </div>
    )
}

export default VoteTimelineGraph
