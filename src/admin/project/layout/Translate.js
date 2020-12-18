import React from 'react'
import useTheme from '@material-ui/core/styles/useTheme'
import { useForkRef } from '@material-ui/core/utils'
import { debounce } from 'lodash'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'
import { elementAcceptingRef } from '@material-ui/utils'

function ownerDocument(node) {
    return (node && node.ownerDocument) || document
}
function ownerWindow(node) {
    const doc = ownerDocument(node)
    return doc.defaultView || window
}

// Follow https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
// to learn when use what timing
const duration = {
    shortest: 150,
    shorter: 200,
    short: 250,
    // most basic recommended timing
    standard: 300,
    // this is to be used in complex animations
    complex: 375,
    // recommended when something is entering screen
    enteringScreen: 225,
    // recommended when something is leaving screen
    leavingScreen: 195,
}

const reflow = (node) => node.scrollTop

function getTransitionProps(props, options) {
    const { timeout, style = {} } = props

    return {
        duration:
            style.transitionDuration || typeof timeout === 'number'
                ? timeout
                : timeout[options.mode] || 0,
        delay: style.transitionDelay,
    }
}

// Translate the node so it can't be seen on the screen.
// Later, we're going to translate the node back to its original location with `none`.
function getTranslateValue(direction, node) {
    const rect = node.getBoundingClientRect()
    const containerWindow = ownerWindow(node)
    let transform

    if (node.fakeTransform) {
        transform = node.fakeTransform
    } else {
        const computedStyle = containerWindow.getComputedStyle(node)
        transform =
            computedStyle.getPropertyValue('-webkit-transform') ||
            computedStyle.getPropertyValue('transform')
    }

    let offsetX = 0
    let offsetY = 0

    if (transform && transform !== 'none' && typeof transform === 'string') {
        const transformValues = transform.split('(')[1].split(')')[0].split(',')
        offsetX = parseInt(transformValues[4], 10)
        offsetY = parseInt(transformValues[5], 10)
    }

    if (direction === 'left') {
        return `translateX(${containerWindow.innerWidth}px) translateX(${
            offsetX - rect.left
        }px)`
    }

    if (direction === 'right') {
        return `translateX(-${rect.left + rect.width - offsetX}px)`
    }

    if (direction === 'up') {
        return `translateY(${containerWindow.innerHeight}px) translateY(${
            offsetY - rect.top
        }px)`
    }

    // direction === 'down'
    return `translateY(-${rect.top + rect.height - offsetY}px)`
}

function setTranslateValue(direction, node) {
    const transform = getTranslateValue(direction, node)

    if (transform) {
        node.style.webkitTransform = transform
        node.style.transform = transform
    }
}

const defaultTimeout = {
    enter: duration.enteringScreen,
    exit: duration.leavingScreen,
}

/**
 * The Slide transition is used by the [Drawer](/components/drawers/) component.
 * It uses [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 */
const Slide = React.forwardRef(function Slide(props, ref) {
    const {
        appear = true,
        children,
        direction = 'down',
        in: inProp,
        onEnter,
        onEntered,
        onEntering,
        onExit,
        onExited,
        onExiting,
        style,
        timeout = defaultTimeout,
        // eslint-disable-next-line react/prop-types
        TransitionComponent = Transition,
        ...other
    } = props

    const theme = useTheme()
    const childrenRef = React.useRef(null)
    const handleRefIntermediary = useForkRef(children.ref, childrenRef)
    const handleRef = useForkRef(handleRefIntermediary, ref)

    const normalizedTransitionCallback = (callback) => (isAppearing) => {
        if (callback) {
            // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
            if (isAppearing === undefined) {
                callback(childrenRef.current)
            } else {
                callback(childrenRef.current, isAppearing)
            }
        }
    }

    const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
        setTranslateValue(direction, node)
        reflow(node)

        if (onEnter) {
            onEnter(node, isAppearing)
        }
    })

    const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
        const transitionProps = getTransitionProps(
            { timeout, style },
            {
                mode: 'enter',
            }
        )

        node.style.webkitTransition = theme.transitions.create(
            '-webkit-transform',
            {
                ...transitionProps,
                easing: theme.transitions.easing.easeOut,
            }
        )

        node.style.transition = theme.transitions.create('transform', {
            ...transitionProps,
            easing: theme.transitions.easing.easeOut,
        })

        node.style.webkitTransform = 'none'
        node.style.transform = 'none'
        if (onEntering) {
            onEntering(node, isAppearing)
        }
    })

    const handleEntered = normalizedTransitionCallback(onEntered)
    const handleExiting = normalizedTransitionCallback(onExiting)

    const handleExit = normalizedTransitionCallback((node) => {
        const transitionProps = getTransitionProps(
            { timeout, style },
            {
                mode: 'exit',
            }
        )

        node.style.webkitTransition = theme.transitions.create(
            '-webkit-transform',
            {
                ...transitionProps,
                easing: theme.transitions.easing.sharp,
            }
        )

        node.style.transition = theme.transitions.create('transform', {
            ...transitionProps,
            easing: theme.transitions.easing.sharp,
        })

        setTranslateValue(direction, node)

        if (onExit) {
            onExit(node)
        }
    })

    const handleExited = normalizedTransitionCallback((node) => {
        // No need for transitions when the component is hidden
        node.style.webkitTransition = ''
        node.style.transition = ''

        if (onExited) {
            onExited(node)
        }
    })

    const updatePosition = React.useCallback(() => {
        if (childrenRef.current) {
            setTranslateValue(direction, childrenRef.current)
        }
    }, [direction])

    React.useEffect(() => {
        // Skip configuration where the position is screen size invariant.
        if (inProp || direction === 'down' || direction === 'right') {
            return undefined
        }

        const handleResize = debounce(() => {
            if (childrenRef.current) {
                setTranslateValue(direction, childrenRef.current)
            }
        })

        const containerWindow = ownerWindow(childrenRef.current)
        containerWindow.addEventListener('resize', handleResize)
        return () => {
            handleResize.clear()
            containerWindow.removeEventListener('resize', handleResize)
        }
    }, [direction, inProp])

    React.useEffect(() => {
        if (!inProp) {
            // We need to update the position of the drawer when the direction change and
            // when it's hidden.
            updatePosition()
        }
    }, [inProp, updatePosition])

    return (
        <TransitionComponent
            nodeRef={childrenRef}
            onEnter={handleEnter}
            onEntered={handleEntered}
            onEntering={handleEntering}
            onExit={handleExit}
            onExited={handleExited}
            onExiting={handleExiting}
            appear={appear}
            in={inProp}
            timeout={timeout}
            {...other}>
            {(state, childProps) => {
                return React.cloneElement(children, {
                    ref: handleRef,
                    style: {
                        visibility:
                            state === 'exited' && !inProp
                                ? 'hidden'
                                : undefined,
                        ...style,
                        ...children.props.style,
                    },
                    ...childProps,
                })
            }}
        </TransitionComponent>
    )
})

Slide.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // |     To update them edit the d.ts file and run "yarn proptypes"     |
    // ----------------------------------------------------------------------
    /**
     * Perform the enter transition when it first mounts if `in` is also `true`.
     * Set this to `false` to disable this behavior.
     * @default true
     */
    appear: PropTypes.bool,
    /**
     * A single child content element.
     */
    children: elementAcceptingRef,
    /**
     * Direction the child node will enter from.
     * @default 'down'
     */
    direction: PropTypes.oneOf(['down', 'left', 'right', 'up']),
    /**
     * If `true`, show the component; triggers the enter or exit animation.
     */
    in: PropTypes.bool,
    /**
     * @ignore
     */
    onEnter: PropTypes.func,
    /**
     * @ignore
     */
    onEntered: PropTypes.func,
    /**
     * @ignore
     */
    onEntering: PropTypes.func,
    /**
     * @ignore
     */
    onExit: PropTypes.func,
    /**
     * @ignore
     */
    onExited: PropTypes.func,
    /**
     * @ignore
     */
    onExiting: PropTypes.func,
    /**
     * @ignore
     */
    style: PropTypes.object,
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     * @default {
     *   enter: duration.enteringScreen,
     *   exit: duration.leavingScreen,
     * }
     */
    timeout: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            appear: PropTypes.number,
            enter: PropTypes.number,
            exit: PropTypes.number,
        }),
    ]),
}

export default Slide
