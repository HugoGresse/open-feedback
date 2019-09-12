import React, { useState } from 'react'
import styled from 'styled-components'
import ColorBlockDialog from './ColorBlockDialog'

const Color = styled.div`
    height: 40px;
    width: 40px;
    display: inline-block;
    border-radius: 2px;
    margin: 3px 5px 5px 0;
    ${props =>
        props.color
            ? `background-color: #${props.color};`
            : ` background-color: RED;`}
    border: 1px solid #eee;
    transition: all 200ms;

    &:hover {
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    &::selected {
        background-color: 'transparent';
    }
`

const ColorBlock = ({ color, onColorChanged, onColorDeleted, className }) => {
    const [isPickerOpen, setPickerOpen] = useState(false)
    const [stateColor, setColor] = useState(color)

    const onColorPicked = color => {
        setPickerOpen(false)
        setColor(color)
        onColorChanged(color)
    }

    const onColorDelete = color => {
        setPickerOpen(false)
        onColorDeleted(color)
    }

    return (
        <>
            <Color
                color={stateColor}
                className={className}
                onClick={() => setPickerOpen(true)}
            />

            <ColorBlockDialog
                open={isPickerOpen}
                color={stateColor}
                onClose={color => () => onColorPicked(color)}
                onColorDeleted={color => () => onColorDelete(color)}
            />
        </>
    )
}

export default ColorBlock
