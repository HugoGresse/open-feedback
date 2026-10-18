import {
    forwardRef,
    useRef,
    useCallback,
    useEffect,
    cloneElement,
    type ComponentType,
    type CSSProperties,
    type ReactElement,
    type Ref,
} from 'react'
import { useTheme } from '@mui/material/styles'
import { useForkRef } from '@mui/material/utils'
import { debounce } from 'lodash'
import Transition, {
    type TransitionProps,
} from 'react-transition-group/Transition'

type TranslateDirection = 'down' | 'left' | 'right' | 'up'

type TranslateTimeout =
    | number
    | { appear?: number; enter?: number; exit?: number }

type EnterCallback = (node: HTMLElement, isAppearing?: boolean) => void
type ExitCallback = (node: HTMLElement) => void

export interface TranslateProps {
    /**
     * Perform the enter transition when it first mounts if `in` is also `true`.
     * Set this to `false` to disable this behavior.
     */
    appear?: boolean
    /** A single child content element, able to hold a ref. */
    children: ReactElement<{
        style?: CSSProperties
        ref?: Ref<HTMLElement>
    }> & { ref?: Ref<HTMLElement> }
    /** Direction the child node will enter from. */
    direction?: TranslateDirection
    /** If `true`, show the component; triggers the enter or exit animation. */
    in?: boolean
    onEnter?: EnterCallback
    onEntered?: EnterCallback
    onEntering?: EnterCallback
    onExit?: ExitCallback
    onExited?: ExitCallback
    onExiting?: ExitCallback
    style?: CSSProperties
    /** The duration for the transition, in milliseconds. */
    timeout?: TranslateTimeout
    TransitionComponent?: ComponentType<TransitionProps<HTMLElement>>
}

function ownerDocument(node: Node | null) {
    return (node && node.ownerDocument) || document
}
function ownerWindow(node: Node | null) {
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

const reflow = (node: HTMLElement) => node.scrollTop

function getTransitionProps(
    props: { timeout: TranslateTimeout; style?: CSSProperties },
    options: { mode: 'enter' | 'exit' }
) {
    const { timeout, style = {} } = props

    return {
        duration:
            style.transitionDuration ||
            (typeof timeout === 'number'
                ? timeout
                : timeout[options.mode] || 0),
        delay: style.transitionDelay,
    }
}

// Translate the node so it can't be seen on the screen.
// Later, we're going to translate the node back to its original location with `none`.
function getTranslateValue(direction: TranslateDirection, node: HTMLElement) {
    const rect = node.getBoundingClientRect()
    const containerWindow = ownerWindow(node)

    const offsetX = 0
    // OF Change
    const offsetY = 70

    // OF Change
    // if (transform && transform !== 'none' && typeof transform === 'string') {
    //     const transformValues = transform.split('(')[1].split(')')[0].split(',')
    //     offsetX = parseInt(transformValues[4], 10)
    //     offsetY = parseInt(transformValues[5], 10)
    // }

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

function setTranslateValue(direction: TranslateDirection, node: HTMLElement) {
    const transform = getTranslateValue(direction, node)

    if (transform) {
        node.style.webkitTransform = transform
        node.style.transform = transform
    }
}

const defaultTimeout: TranslateTimeout = {
    enter: duration.enteringScreen,
    exit: duration.leavingScreen,
}

/**
 * The Slide transition is used by the [Drawer](/components/drawers/) component.
 * It uses [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 */
export const Translate = forwardRef<HTMLElement, TranslateProps>(
    function Translate(props, ref) {
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
            TransitionComponent = Transition,
            ...other
        } = props

        const theme = useTheme()
        const childrenRef = useRef<HTMLElement>(null)
        const handleRefIntermediary = useForkRef(children.ref, childrenRef)
        const handleRef = useForkRef(handleRefIntermediary, ref)

        const normalizedTransitionCallback =
            (callback?: EnterCallback) => (isAppearing?: boolean) => {
                if (callback) {
                    // The Transition only calls back while the child (nodeRef) is mounted
                    const node = childrenRef.current as HTMLElement
                    // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
                    if (isAppearing === undefined) {
                        callback(node)
                    } else {
                        callback(node, isAppearing)
                    }
                }
            }

        const handleEnter = normalizedTransitionCallback(
            (node, isAppearing) => {
                setTranslateValue(direction, node)
                reflow(node)

                if (onEnter) {
                    onEnter(node, isAppearing)
                }
            }
        )

        const handleEntering = normalizedTransitionCallback(
            (node, isAppearing) => {
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
            }
        )

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
            // node.style.webkitTransition = ''
            // node.style.transition = ''

            if (onExited) {
                onExited(node)
            }
        })

        const updatePosition = useCallback(() => {
            if (childrenRef.current) {
                setTranslateValue(direction, childrenRef.current)
            }
        }, [direction])

        useEffect(() => {
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
                handleResize.cancel()
                containerWindow.removeEventListener('resize', handleResize)
            }
        }, [direction, inProp])

        useEffect(() => {
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
                {...other}
            >
                {(state, childProps) => {
                    // OF Change
                    return cloneElement(children, {
                        ref: handleRef,
                        style: {
                            ...style,
                            ...children.props.style,
                        },
                        ...childProps,
                    })
                }}
            </TransitionComponent>
        )
    }
)
