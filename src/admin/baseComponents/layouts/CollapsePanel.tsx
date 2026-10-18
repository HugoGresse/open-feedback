import { useState, type ReactNode } from 'react'
import { Collapse } from '@mui/material'
import ArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { OFButton } from '../button/OFButton.tsx'

export interface CollapsePanelProps {
    children?: ReactNode
    buttonText: ReactNode
}

export const CollapsePanel = ({ children, buttonText }: CollapsePanelProps) => {
    const [isExpanded, setExpanded] = useState(false)

    return (
        <>
            <OFButton
                onClick={() => setExpanded(!isExpanded)}
                style={{ design: 'text', marginTop: 8, marginBottom: 8 }}
            >
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
        </>
    )
}
