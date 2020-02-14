import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { useTheme } from '@nivo/core'
import COLORS from '../../../constants/colors'

const VoteTimelineGraph = ({ votes }) => {
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
                tickSize: 4,
                tickCount: 2,
                renderTick: HorizontalTick,
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 0,
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

const HorizontalTick = tick => {
    const theme = useTheme()

    // Hide first tick at 0, 0
    if (tick.tickIndex === 0) {
        return null
    }

    return (
        <g opacity={tick.opacity} transform={`translate(${tick.x},${tick.y})`}>
            <line stroke="#ccc" strokeWidth={1} y1={0} y2={7} />
            <g transform={`translate(0,${tick.y + 16})`}>
                <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                        ...theme.axis.ticks.text,
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
            }}>
            {slice.points.map(point => (
                <div
                    key={point.id}
                    style={{
                        color: point.serieColor,
                    }}>
                    <strong>{point.data.yFormatted} vote(s)</strong>{' '}
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
