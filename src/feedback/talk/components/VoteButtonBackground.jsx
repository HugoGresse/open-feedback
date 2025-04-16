import React, { useRef, useEffect, useCallback } from 'react'
import { getRandomArbitrary } from '../../utils/Random'
import Box from '@mui/material/Box'

const circleRadius = 15

const TalkItemVoteBackground = ({ count = 0, colors }) => {
    const refElement = useRef(null)
    const canvasRef = useRef(null)
    const canvasState = useRef({
        circles: [],
    })

    const createRandomCircle = useCallback(
        (ctx, count) => {
            if (count === undefined || !ctx) {
                return
            }

            if (!refElement.current || !canvasRef.current) return

            const width = refElement.current.clientWidth
            const height = refElement.current.clientHeight
            const scale = window.devicePixelRatio

            canvasRef.current.style.width = `${width}px`
            canvasRef.current.style.height = `${height}px`
            canvasRef.current.width = width * scale
            canvasRef.current.height = height * scale

            // Scale for high DPI displays
            ctx.scale(scale, scale)

            const circles = canvasState.current.circles
            const currentLength = circles.length

            // Only update circles if count has changed
            if (count !== currentLength) {
                if (count > currentLength) {
                    // Add new circles
                    const newCircles = Array(count - currentLength)
                        .fill(null)
                        .map(() => ({
                            x: getRandomArbitrary(0, width),
                            y: getRandomArbitrary(0, height),
                            opacity: Math.floor(Math.random() * 80) + 20,
                        }))
                    circles.push(...newCircles)
                } else {
                    // Remove excess circles
                    circles.length = count
                }
            }

            ctx.clearRect(0, 0, width, height)

            circles.forEach((circle, index) => {
                let fillStyle =
                    '#' +
                    colors[0] +
                    circle.opacity.toString(16).padStart(2, '0')
                if (colors.length > 1) {
                    fillStyle = '#' + colors[index % colors.length] + '60'
                }
                ctx.fillStyle = fillStyle
                ctx.beginPath()
                ctx.arc(circle.x, circle.y, circleRadius, 0, 2 * Math.PI)
                ctx.fill()
            })

            // Only update state if circles array has changed
            if (count !== currentLength) {
                canvasState.current = {
                    circles: circles,
                }
            }
        },
        [colors]
    )

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            createRandomCircle(ctx, count)
        }

        return () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d')
                if (ctx) {
                    ctx.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    )
                }
            }
        }
    }, [count, createRandomCircle])

    return (
        <>
            <Box
                ref={refElement}
                position="absolute"
                width="100%"
                height="100%"
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            />
        </>
    )
}

export default React.memo(TalkItemVoteBackground)
