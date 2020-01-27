import React from 'react'
import ReactDOM from 'react-dom'
import useTheme from '@material-ui/core/styles/useTheme'
import { useForkRef } from '@material-ui/core/utils'
import { debounce } from 'lodash'
import Transition from 'react-transition-group/Transition'

const reflow = node => node.scrollTop

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

// Translate the node so he can't be seen on the screen.
// Later, we gonna translate back the node to his original location
// with `none`.`
function getTranslateValue(direction, node) {
    const rect = node.getBoundingClientRect()

    let offsetX = 0

    const offsetY = 70

    if (direction === 'left') {
        return `translateX(${window.innerWidth}px) translateX(-${rect.left -
            offsetX}px)`
    }

    if (direction === 'right') {
        return `translateX(-${rect.left + rect.width - offsetX}px)`
    }

    if (direction === 'up') {
        return `translateY(${window.innerHeight}px) translateY(-${rect.top -
            offsetY}px)`
    }

    // direction === 'down'
    return `translateY(-${rect.top + rect.height - offsetY}px)`
}

export function setTranslateValue(direction, node) {
    const transform = getTranslateValue(direction, node)

    if (transform) {
        node.style.webkitTransform = transform
        node.style.transform = transform
    }
}

const defaultTimeout = {
    enter: 200,
    exit: 200,
}

/**
 * Fork of the Slide transition from MUI but only translate, without changing visibility
 * From : https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Slide/Slide.js
 */
const Translate = React.forwardRef(function Translate(props, ref) {
    const {
        children,
        direction = 'down',
        in: inProp,
        onEnter,
        onEntering,
        onExit,
        onExited,
        style,
        timeout = defaultTimeout,
        ...other
    } = props

    const theme = useTheme()
    const childrenRef = React.useRef(null)
    /**
     * used in cloneElement(children, { ref: handleRef })
     */
    const handleOwnRef = React.useCallback(instance => {
        // #StrictMode ready
        childrenRef.current = ReactDOM.findDOMNode(instance)
    }, [])
    const handleRefIntermediary = useForkRef(children.ref, handleOwnRef)
    const handleRef = useForkRef(handleRefIntermediary, ref)

    const handleEnter = () => {
        const node = childrenRef.current
        setTranslateValue(direction, node)
        reflow(node)

        if (onEnter) {
            onEnter(node)
        }
    }

    const handleEntering = () => {
        const node = childrenRef.current
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
            onEntering(node)
        }
    }

    const handleExit = () => {
        const node = childrenRef.current
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
    }

    const handleExited = () => {
        if (onExited) {
            onExited(childrenRef.current)
        }
    }

    const updatePosition = React.useCallback(() => {
        if (childrenRef.current) {
            setTranslateValue(direction, childrenRef.current)
        }
    }, [direction])

    React.useEffect(() => {
        // Skip configuration where the position is screen size invariant.
        if (!inProp && direction !== 'down' && direction !== 'right') {
            const handleResize = debounce(() => {
                if (childrenRef.current) {
                    setTranslateValue(direction, childrenRef.current)
                }
            })

            window.addEventListener('resize', handleResize)

            return () => {
                handleResize.clear()
                window.removeEventListener('resize', handleResize)
            }
        }

        return undefined
    }, [direction, inProp])

    React.useEffect(() => {
        if (!inProp) {
            // We need to update the position of the drawer when the direction change and
            // when it's hidden.
            updatePosition()
        }
    }, [inProp, updatePosition])

    return (
        <Transition
            onEnter={handleEnter}
            onEntering={handleEntering}
            onExit={handleExit}
            onExited={handleExited}
            appear
            in={inProp}
            timeout={timeout}
            {...other}>
            {(state, childProps) => {
                return React.cloneElement(children, {
                    ref: handleRef,
                    style: {
                        ...style,
                        ...children.props.style,
                    },
                    ...childProps,
                })
            }}
        </Transition>
    )
})

export default Translate
