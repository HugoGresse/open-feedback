import React, { useEffect, useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Box from '@material-ui/core/Box'
import { newRandomHexColor } from '../../../../utils/colorsUtils'

const useStyles = makeStyles({
    canvas: {
        position: 'relative',
    },
    refElement: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
})

const DinoBackground = ({ speed = 5 }) => {
    const classes = useStyles()
    const [canvasRef] = useState(React.createRef())
    const [refElement] = useState(React.createRef())

    useEffect(() => {
        if (!canvasRef || !canvasRef.current || !refElement) return
        const ctx = canvasRef.current.getContext('2d')
        const dinoWidth = 40
        const dinoScale = 0.2
        const dinoYOffset = 90

        if (refElement.current != null) {
            const width = refElement.current.clientWidth
            const height = refElement.current.clientHeight + 100
            const scale = window.devicePixelRatio
            canvasRef.current.style.width = width + 'px'
            canvasRef.current.style.height = height + 'px'
            canvasRef.current.width = width * scale
            canvasRef.current.height = height * scale
            ctx.scale(scale, scale)
        }

        let moveX = 0
        let firstColor = `#${newRandomHexColor()}88`
        let secondColor = `#${newRandomHexColor()}88`
        let firstSwift = false
        let isFirstHalf = false
        let model = false
        const animate = () => {
            if (!refElement.current) {
                return
            }
            isFirstHalf = moveX < refElement.current.clientWidth / 2
            model = moveX % 100 > 50 || moveX % 100 < 0

            moveX += speed

            ctx.clearRect(
                0,
                0,
                refElement.current.clientWidth,
                canvasRef.current.height
            )

            if (firstSwift) {
                ctx.fillStyle = firstColor
            } else {
                ctx.fillStyle = secondColor
            }

            Dino(ctx, dinoScale, moveX, dinoYOffset, model)

            if ((firstSwift && isFirstHalf) || (!firstSwift && !isFirstHalf)) {
                ctx.fillStyle = firstColor
            } else {
                ctx.fillStyle = secondColor
            }

            Dino(
                ctx,
                dinoScale,
                -refElement.current.clientWidth + moveX,
                dinoYOffset,
                model
            )

            if ((firstSwift && !isFirstHalf) || (!firstSwift && isFirstHalf)) {
                ctx.fillStyle = firstColor
            } else {
                ctx.fillStyle = secondColor
            }

            Dino(
                ctx,
                dinoScale,
                refElement.current.clientWidth + moveX,
                dinoYOffset,
                model
            )

            if (moveX > refElement.current.clientWidth - dinoWidth) {
                moveX = -dinoWidth
                firstSwift = !firstSwift
            }

            window.requestAnimationFrame(animate)
        }
        animate()
    }, [canvasRef, refElement, speed])

    return (
        <Box height="200px" position="absolute" width="100%">
            <div ref={refElement} className={classes.refElement} />
            <canvas ref={canvasRef} className={classes.canvas} style={{}} />
        </Box>
    )
}

const Dino = (context, scale, offsetX = 0, offsetY = 0, rightLegUp = true) => {
    const ctx = context

    ctx.beginPath()
    ctx.moveTo(302 * scale + offsetX, 98 * scale + offsetY)
    ctx.lineTo(302 * scale + offsetX, 18 * scale + offsetY)
    ctx.lineTo(287 * scale + offsetX, 18 * scale + offsetY)
    ctx.lineTo(287 * scale + offsetX, offsetY)
    ctx.lineTo(166 * scale + offsetX, offsetY)
    ctx.lineTo(166 * scale + offsetX, 18 * scale + offsetY)
    ctx.lineTo(151 * scale + offsetX, 18 * scale + offsetY)
    ctx.lineTo(151 * scale + offsetX, 44 * scale + offsetY)
    ctx.lineTo(151 * scale + offsetX, 45 * scale + offsetY)
    ctx.lineTo(151 * scale + offsetX, 134 * scale + offsetY)
    ctx.lineTo(135 * scale + offsetX, 134 * scale + offsetY)
    ctx.lineTo(135 * scale + offsetX, 152 * scale + offsetY)
    ctx.lineTo(112 * scale + offsetX, 152 * scale + offsetY)
    ctx.lineTo(112 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(90 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(90 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(75 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(75 * scale + offsetX, 206 * scale + offsetY)
    ctx.lineTo(44 * scale + offsetX, 206 * scale + offsetY)
    ctx.lineTo(44 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(29 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(29 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(14 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(14 * scale + offsetX, 134 * scale + offsetY)
    ctx.lineTo(offsetX, 134 * scale + offsetY)
    ctx.lineTo(offsetX, 242 * scale + offsetY)
    ctx.lineTo(14 * scale + offsetX, 242 * scale + offsetY)
    ctx.lineTo(14 * scale + offsetX, 259 * scale + offsetY)
    ctx.lineTo(29 * scale + offsetX, 259 * scale + offsetY)
    ctx.lineTo(29 * scale + offsetX, 277 * scale + offsetY)
    ctx.lineTo(44 * scale + offsetX, 277 * scale + offsetY)
    ctx.lineTo(44 * scale + offsetX, 295 * scale + offsetY)
    ctx.lineTo(59 * scale + offsetX, 295 * scale + offsetY)
    ctx.lineTo(59 * scale + offsetX, 313 * scale + offsetY)
    ctx.lineTo(75 * scale + offsetX, 313 * scale + offsetY)
    ctx.lineTo(75 * scale + offsetX, 331 * scale + offsetY)
    ctx.lineTo(75 * scale + offsetX, 367 * scale + offsetY)
    ctx.lineTo(75 * scale + offsetX, 385 * scale + offsetY)

    if (rightLegUp) {
        ctx.lineTo(105 * scale + offsetX, 385 * scale + offsetY)
        ctx.lineTo(105 * scale + offsetX, 367 * scale + offsetY)
        ctx.lineTo(90 * scale + offsetX, 367 * scale + offsetY)
        ctx.lineTo(90 * scale + offsetX, 349 * scale + offsetY)
        ctx.lineTo(105 * scale + offsetX, 349 * scale + offsetY)
        ctx.lineTo(105 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(120 * scale + offsetX, 331 * scale + offsetY)
    } else {
        ctx.lineTo(75 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(91 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(91 * scale + offsetX, 349 * scale + offsetY)
        ctx.lineTo(121 * scale + offsetX, 349 * scale + offsetY)
        ctx.lineTo(121 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(106 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(106 * scale + offsetX, 313 * scale + offsetY)
    }

    if (rightLegUp) {
        ctx.lineTo(150 * scale + offsetX, 313 * scale + offsetY)
        ctx.lineTo(150 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(187 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(187 * scale + offsetX, 313 * scale + offsetY)
    } else {
        ctx.lineTo(120 * scale + offsetX, 313 * scale + offsetY)
        ctx.lineTo(135 * scale + offsetX, 313 * scale + offsetY)
        ctx.lineTo(135 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(151 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(151 * scale + offsetX, 367 * scale + offsetY)
        ctx.lineTo(151 * scale + offsetX, 385 * scale + offsetY)
        ctx.lineTo(181 * scale + offsetX, 385 * scale + offsetY)
        ctx.lineTo(181 * scale + offsetX, 367 * scale + offsetY)
        ctx.lineTo(166 * scale + offsetX, 367 * scale + offsetY)
        ctx.lineTo(166 * scale + offsetX, 331 * scale + offsetY)
        ctx.lineTo(166 * scale + offsetX, 331 * scale + offsetY)
    }

    ctx.lineTo(166 * scale + offsetX, 313 * scale + offsetY)
    ctx.lineTo(166 * scale + offsetX, 295 * scale + offsetY)
    ctx.lineTo(181 * scale + offsetX, 295 * scale + offsetY)
    ctx.lineTo(181 * scale + offsetX, 277 * scale + offsetY)
    ctx.lineTo(196 * scale + offsetX, 277 * scale + offsetY)
    ctx.lineTo(196 * scale + offsetX, 250 * scale + offsetY)
    ctx.lineTo(211 * scale + offsetX, 250 * scale + offsetY)
    ctx.lineTo(211 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(211 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(227 * scale + offsetX, 188 * scale + offsetY)
    ctx.lineTo(227 * scale + offsetX, 205 * scale + offsetY)
    ctx.lineTo(241 * scale + offsetX, 205 * scale + offsetY)
    ctx.lineTo(241 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(227 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(211 * scale + offsetX, 170 * scale + offsetY)
    ctx.lineTo(211 * scale + offsetX, 134 * scale + offsetY)
    ctx.lineTo(272 * scale + offsetX, 134 * scale + offsetY)
    ctx.lineTo(272 * scale + offsetX, 116 * scale + offsetY)
    ctx.lineTo(226 * scale + offsetX, 116 * scale + offsetY)
    ctx.lineTo(226 * scale + offsetX, 98 * scale + offsetY)
    ctx.lineTo(302 * scale + offsetX, 98 * scale + offsetY)
    ctx.closePath()
    ctx.moveTo(181 * scale + offsetX, 26 * scale + offsetY)
    ctx.lineTo(196 * scale + offsetX, 26 * scale + offsetY)
    ctx.lineTo(196 * scale + offsetX, 44 * scale + offsetY)
    ctx.lineTo(181 * scale + offsetX, 44 * scale + offsetY)
    ctx.lineTo(181 * scale + offsetX, 26 * scale + offsetY)
    ctx.closePath()

    ctx.fill()
}

export default DinoBackground
