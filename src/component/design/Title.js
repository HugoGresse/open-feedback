import { Component } from 'react'
import styled from 'styled-components'
import React from 'react'
import { space, fontSize, fontWeight } from 'styled-system'

const TitleH1 = styled.h1`
    color: ${props => props.color};
    ${fontSize}
    ${fontWeight}
    ${space}
`
const TitleH2 = styled.h2`
    color: ${props => props.color};
    ${fontSize}
    ${fontWeight}
    ${space}
`
const TitleH3 = styled.h3`
    color: ${props => props.color};
    ${fontSize}
    ${fontWeight}
    ${space}
`

class Title extends Component {
    render() {
        const { children, component, color, ...props } = this.props
        if (component === 'h1')
            return (
                <TitleH1 color={color} {...props}>
                    {children}
                </TitleH1>
            )
        if (component === 'h2')
            return (
                <TitleH2 color={color} {...props}>
                    {children}
                </TitleH2>
            )
        return (
            <TitleH3 color={color} {...props}>
                {children}
            </TitleH3>
        )
    }
}

export default Title
