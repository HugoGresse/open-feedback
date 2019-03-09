import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { fontSize, fontWeight, space } from 'styled-system'

const TitleCss = css`
    color: ${props => props.color};
    font-weight: 400;
    ${fontSize}
    ${fontWeight}
    ${space}
`

const TitleH1 = styled.h1`
    ${TitleCss}
`
const TitleH2 = styled.h2`
    ${TitleCss}
`
const TitleH3 = styled.h3`
    ${TitleCss}
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
        if (component === 'h3')
            return (
                <TitleH3 color={color} {...props}>
                    {children}
                </TitleH3>
            )
        return (
            <TitleH2 color={color} {...props}>
                {children}
            </TitleH2>
        )
    }
}

export default Title
