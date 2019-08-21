import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'

import PropTypes from 'prop-types'
import { getRandomArbitrary } from '../utils/Random'

const styles = theme => ({
    canvas: {
        position: 'absolute'
    },
    refElement: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
})

const circleRadius = 15

class SessionItemVoteBackground extends Component {
    constructor(props) {
        super(props)
        this.refElement = React.createRef()
        this.canvasRef = React.createRef()
        this.canvasState = {
            isDrawn: false,
            circles: []
        }
    }

    componentDidMount() {
        if (this.props.count && this.canvasRef.current) {
            this.createRandomCircle(
                this.canvasRef.current.getContext('2d'),
                this.props.count
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.count && this.canvasRef.current) {
            if (this.props.count !== prevProps.count) {
                this.canvasState = {
                    ...this.canvasState,
                    isDrawn: false
                }
            }
            this.createRandomCircle(
                this.canvasRef.current.getContext('2d'),
                this.props.count
            )
        }
    }

    createRandomCircle(ctx, count) {
        if (count === undefined || this.canvasState.isDrawn) {
            return
        }

        this.canvasRef.current.style.width =
            this.refElement.current.clientWidth + 'px'
        this.canvasRef.current.style.height =
            this.refElement.current.clientHeight + 'px'
        const scale = window.devicePixelRatio
        const width = this.refElement.current.clientWidth
        const height = this.refElement.current.clientHeight
        this.canvasRef.current.width = width * scale
        this.canvasRef.current.height = height * scale

        ctx.scale(scale, scale)

        const circles = this.canvasState.circles
        if (count > circles.length) {
            const diff = count - circles.length
            for (let i = 0; i < diff; i++) {
                circles.push({
                    x: getRandomArbitrary(0, width),
                    y: getRandomArbitrary(0, height)
                })
            }
        } else if (count < circles.length) {
            const diff = circles.length - count
            for (let i = 0; i < diff; i++) {
                circles.pop()
            }
        }

        ctx.clearRect(0, 0, width, height)

        circles.forEach((circle, index) => {
            const randomOpacity = parseInt(Math.random() * 80) + 20
            let fillStyle = '#' + this.props.colors[0] + randomOpacity
            if (this.props.colors.length > 1) {
                fillStyle =
                    '#' +
                    this.props.colors[index % this.props.colors.length] +
                    '60'
            }
            ctx.fillStyle = fillStyle
            ctx.beginPath()
            ctx.arc(circle.x, circle.y, circleRadius, 0, 2 * Math.PI)
            ctx.fill()
        })

        this.canvasState = {
            ...this.canvasState,
            circles: circles,
            isDrawn: true
        }
    }

    render() {
        const { classes } = this.props

        return (
            <>
                <div ref={this.refElement} className={classes.refElement} />
                <canvas ref={this.canvasRef} className={classes.canvas} />
            </>
        )
    }
}

SessionItemVoteBackground.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number,
    colors: PropTypes.array
}

export default withStyles(styles)(SessionItemVoteBackground)
