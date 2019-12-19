import React from 'react'
import styled from 'styled-components'
import {
    alignItems,
    background,
    borderRadius,
    color,
    display,
    flexBasis,
    flexDirection,
    fontSize,
    fontWeight,
    height,
    justifyContent,
    maxWidth,
    space,
    textAlign,
    width,
    position,
} from 'styled-system'

const BoxStyled = styled.div`
    ${position}
    ${width}
    ${height}
    ${maxWidth}
    ${alignItems}
    ${space}
    ${justifyContent}
    ${fontWeight}
    ${fontSize}
    ${textAlign}
    ${color}
    ${borderRadius}
    ${flexDirection}
    ${flexBasis}
    ${display}
    ${background}

    ${props =>
        props.flex &&
        `
    display: flex;
  `}

    ${props =>
        props.flexGrow &&
        `
    flex-grow: ${props.flexGrow};
  `}
`

const Box = ({ children, ...props }) => {
    return <BoxStyled {...props}>{children}</BoxStyled>
}

export default Box
