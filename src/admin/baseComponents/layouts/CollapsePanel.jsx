import React, { useState } from 'react'
import { Collapse } from '@mui/material'
import ArrowDown from '@mui/icons-material/KeyboardArrowDown'
import OFButton from '../button/OFButton.jsx'

const CollapsePanel = ({ children, buttonText }) => {
    const [isExpanded, setExpanded] = useState(false)

    return <>
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
        <Collapse in={isExpanded} collapsedSize={0}>
            {children}
        </Collapse>
    </>;
}

export default CollapsePanel
