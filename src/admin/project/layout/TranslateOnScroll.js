import useScrollTrigger from '@material-ui/core/useScrollTrigger/useScrollTrigger'
import React from 'react'
import Translate from './Translate'

function TranslateOnScroll(props) {
    const { children, window, refTarget } = props

    const newTarget = refTarget || window

    const trigger = useScrollTrigger({ target: newTarget })

    console.log('IsCollapsed: ', trigger)

    return <Translate in={!trigger}>{children}</Translate>
}

export default TranslateOnScroll
