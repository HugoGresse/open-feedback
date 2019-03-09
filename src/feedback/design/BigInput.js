import React, { Component } from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight, space } from 'styled-system'
import { COLORS } from '../../constants/colors'

const BigInputWrapper = styled.div`
    position: relative;
`

const IconWrapper = styled.div`
    position: absolute;
    top: 17px;
    left: 10px;
`

const BigInputStyled = styled.input`
    height: 55px;
    font-size: 23px;
    border: 0px;
    width: 100%;
    background: none;
    box-sizing: border-box;
    ${props => props.icon && ` padding-left: 40px;`}
    ${fontSize}
    ${fontWeight}
    ${space}
    color:${COLORS.DARK_GRAY};

    &::placeholder {
        color: ${COLORS.LIGHT_GRAY};
    }
    &:focus {
        outline-width: 0;
    }
`

class BigInput extends Component {
    render() {
        const { children, icon, ...props } = this.props

        return (
            <BigInputWrapper>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <BigInputStyled icon {...props} />
            </BigInputWrapper>
        )
    }
}

export default BigInput
