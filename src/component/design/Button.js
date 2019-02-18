import { Component } from 'react'
import styled from 'styled-components'
import React from 'react'
import { rgba } from 'polished'
import { space } from 'styled-system'
import { COLORS } from '../../constants/colors'

const ButtonStyled = styled.button`
    outline: none;
    border: none;
    user-select: none;
    text-decoration: none;
    width: auto;

    display: inline-block;
    position: relative;
    padding: 13px 25px;
    border-radius: 4px;

    font-size: 20px;
    line-height: 16px;
    font-weight: 600;
    white-space: nowrap;
    text-align: center;
    background: ${props => props.color || COLORS.RED_ORANGE};
    color: ${COLORS.WHITE};

    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.8;
    }

    ${props =>
        props.outline &&
        `
        background: transparent;
        border: 1px solid ${props.color};
        color: ${props.color}
        &:hover {
            opacity: 1;
            background: ${rgba(props.color, 0.2)}
        }
    `}

    ${space}
`

class Button extends Component {
    render() {
        const { children, ...props } = this.props
        return <ButtonStyled {...props}>{children}</ButtonStyled>
    }
}

export default Button
