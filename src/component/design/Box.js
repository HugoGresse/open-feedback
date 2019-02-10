import { Component } from 'react'
import styled from 'styled-components'
import React from 'react'
import {
    justifyContent,
    fontWeight,
    fontSize,
    textAlign,
    color,
    space,
    alignItems,
    width,
    maxWidth,
    flexDirection,
    display,
    borderRadius
} from 'styled-system'

const BoxStyled = styled.div`
    ${width}
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
    ${display}

    ${props =>
        props.flex &&
        `
    display: flex;
  `}
`

class Box extends Component {
    render() {
        const { children, ...props } = this.props
        return <BoxStyled {...props}>{children}</BoxStyled>
    }
}

export default Box
