import {
    type LineSvgProps,
    ResponsiveLine,
    type SliceTooltipProps,
} from '@nivo/line'
import { HEX_COLORS } from '../../../constants/colors'
import useMediaQuery from '@mui/material/useMediaQuery'
import { animated } from 'react-spring'
import { useTheme as useMuiTheme } from '@mui/material'
import { useTheme as useNivoTheme } from '@nivo/theming'
import type { VoteTimelinePoint } from './dashboardSelectors'

interface VoteSeries {
    id: string
    data: VoteTimelinePoint[]
}

// Axis types of @nivo/axes (not a direct dependency), read from @nivo/line.
type TickRenderer = NonNullable<
    NonNullable<LineSvgProps<VoteSeries>['axisBottom']>['renderTick']
>
type AxisTickProps = Parameters<TickRenderer>[0]

// nivo types renderTick as returning an Element, but it renders whatever the
// function returns, so returning null hides the tick.
const asTickRenderer = (render: (tick: AxisTickProps) => JSX.Element | null) =>
    render as TickRenderer

export interface VoteTimelineGraphProps {
    votes: VoteTimelinePoint[]
}

export const VoteTimelineGraph = ({ votes }: VoteTimelineGraphProps) => {
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
                tickValues: 10,
                renderTick: asTickRenderer(HorizontalTick(isMobile ? 2 : 100)),
            }}
            axisLeft={{
                tickValues: 4,
                renderTick: asTickRenderer(VerticalTick),
            }}
            enablePoints={false}
            enableGridX={false}
            enableSlices="x"
            useMesh={true}
            colors={HEX_COLORS.RED_ORANGE}
            motionConfig={{ tension: 300, friction: 40 }}
        />
    )
}

const VerticalTick = (tick: AxisTickProps) => {
    const theme = useNivoTheme()

    // Hide first tick at 0, 0
    if (tick.tickIndex === 0 || tick.value === 0) {
        return null
    }

    return (
        <animated.g
            transform={`translate(${tick.x},${tick.y + 8})`}
            style={{ opacity: tick.animatedProps.opacity }}
        >
            <text
                textAnchor="start"
                dominantBaseline="middle"
                style={{
                    ...theme.axis.ticks.text,
                    fill: '#888',
                    fontSize: 12,
                }}
            >
                {tick.value}
            </text>
        </animated.g>
    )
}

function HorizontalTick(pointToDisplay: number) {
    const tickFunction = (tick: AxisTickProps) => {
        // Hide first tick at 0, 0
        if (tick.tickIndex === 0) {
            return null
        }

        const opacity =
            parseInt(tick.value) % pointToDisplay === 0
                ? 0
                : tick.animatedProps.opacity

        return (
            <animated.g
                style={{ opacity }}
                transform={`translate(${tick.x},${tick.y})`}
            >
                <line stroke="#ccc" strokeWidth={1} y1={0} y2={7} />
                <g transform={`translate(0,${tick.y + 16})`}>
                    <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                            fill: '#888',
                            fontSize: 12,
                        }}
                    >
                        {tick.value}
                    </text>
                </g>
            </animated.g>
        )
    }
    return tickFunction
}

const Tooltip = ({ slice }: SliceTooltipProps<VoteSeries>) => {
    return (
        <div
            style={{
                padding: 5,
                borderRadius: 5,
                boxShadow: '0 1px 4px #999',
                backgroundColor: '#FFF',
                maxWidth: '40vw',
            }}
        >
            {slice.points.map((point) => (
                <div
                    key={point.id}
                    style={{
                        color: point.seriesColor,
                    }}
                >
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
