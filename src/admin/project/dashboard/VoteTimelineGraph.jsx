import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import COLORS from '../../../constants/colors'
import useMediaQuery from '@mui/material/useMediaQuery';
import { animated } from 'react-spring'
import { useTheme as useMuiTheme } from '@mui/material'
import { useTheme as useNivoTheme} from '@nivo/core'

const VoteTimelineGraph = ({ votes }) => {
    const theme = useMuiTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    return (
        <ResponsiveLine
            data={[
                {
                    id: '1',
                    data: votes,
                },
            ]}
            margin={{ top: 10, right: 10, bottom: 20, left: 20 }}
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

const VerticalTick = (tick) => {
    const theme = useNivoTheme()

    // Hide first tick at 0, 0
    if (tick.tickIndex === 0 || tick.value === 0) {
        return null
    }

    return (
        <animated.g
            transform={`translate(${tick.x},${tick.y + 8})`}
            style={{ opacity: tick.animatedProps.opacity }}>
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
        </animated.g>
    )
}

function HorizontalTick(pointToDisplay) {
    const tickFunction = (tick) => {
        // Hide first tick at 0, 0
        if (tick.tickIndex === 0) {
            return null
        }

        let opacity = tick.animatedProps.opacity
        if (parseInt(tick.value) % pointToDisplay === 0) {
            opacity = 0
        }

        return (
            <animated.g
                style={{ opacity: opacity }}
                transform={`translate(${tick.x},${tick.y})`}>
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
            </animated.g>
        )
    }
    return tickFunction
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
            {slice.points.map((point) => (
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
