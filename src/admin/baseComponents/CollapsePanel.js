import React, { useState } from 'react'
import { Collapse } from '@material-ui/core'
import ArrowDown from '@material-ui/icons/KeyboardArrowDown'
import OFButton from './button/OFButton'

const CollapsePanel = ({ children, buttonText }) => {
    const [isExpanded, setExpanded] = useState(false)

    return (
        <>
            <OFButton
                onClick={() => setExpanded(!isExpanded)}
                style={{ design: 'text', marginTop: 8, marginBottom: 8 }}>
                {buttonText}
                <ArrowDown
                    style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                        transition: '200ms linear',
                    }}
                />
            </OFButton>
            <Collapse in={isExpanded} collapsedHeight={0}>
                {children}
            </Collapse>
        </>
    )
}

export default CollapsePanel
