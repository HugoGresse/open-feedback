import { useState } from 'react'
import styled from 'styled-components'
import { ColorBlockDialog } from './ColorBlockDialog.tsx'

const Color = styled.button<{ color: string }>`
    height: 45px;
    width: 45px;
    display: inline-block;
    border-radius: 2px;
    margin: -1px 5px 5px 0;
    ${(props) =>
        props.color
            ? `background-color: #${props.color};`
            : ` background-color: RED;`}
    border: 1px solid #eee;
    transition: all 200ms;
    ${(props) => (props.disabled ? `opacity: 0.6;` : ``)}

    &:hover {
        ${(props) => (props.disabled ? `` : `cursor: pointer;`)}
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    &::selected {
        background-color: 'transparent';
    }
`

interface ColorBlockProps {
    /** Hex color without `#`. */
    color: string
    onColorChanged: (color: string) => void
    onColorDeleted: (color: string) => void
    className?: string
    disabled?: boolean
}

export const ColorBlock = ({
    color,
    onColorChanged,
    onColorDeleted,
    className,
    disabled,
}: ColorBlockProps) => {
    const [isPickerOpen, setPickerOpen] = useState(false)
    const [stateColor, setColor] = useState(color)

    const onColorPicked = (color: string) => {
        setPickerOpen(false)
        setColor(color)
        onColorChanged(color)
    }

    const onColorDelete = (color: string) => {
        setPickerOpen(false)
        onColorDeleted(color)
    }

    const onColorClicked = () => {
        if (!disabled) {
            setPickerOpen(true)
        }
    }

    return (
        <>
            <Color
                color={stateColor}
                className={className}
                disabled={disabled}
                onClick={() => onColorClicked()}
            />

            <ColorBlockDialog
                open={isPickerOpen}
                color={stateColor}
                onClose={(color) => () => onColorPicked(color)}
                onColorDeleted={(color) => () => onColorDelete(color)}
            />
        </>
    )
}
