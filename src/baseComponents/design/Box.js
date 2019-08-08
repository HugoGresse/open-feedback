import React, { Component } from 'react'
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
    width
} from 'styled-system'

const BoxStyled = styled.div`
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

class Box extends Component {
    render() {
        const { children, ...props } = this.props
        return <BoxStyled {...props}>{children}</BoxStyled>
    }
}

export default Box
