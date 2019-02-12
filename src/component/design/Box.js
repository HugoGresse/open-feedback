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
    flexBasis,
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
    ${flexBasis}
    ${display}

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
