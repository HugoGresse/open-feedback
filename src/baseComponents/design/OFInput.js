import React, { Component } from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight, space } from 'styled-system'
import { COLORS } from '../../constants/colors'

const OFInputWrapper = styled.div`
    position: relative;
`

const IconWrapper = styled.div`
    position: absolute;
    top: 17px;
    left: 10px;
`

const OFInputStyled = styled.input`
    height: 40px;
    font-size: 16px;
    border: 1px solid #EEE;
    width: 100%;
    background: none;
    box-sizing: border-box;
    ${props => (props.icon ? ` padding-left: 40px;` : ` padding-left: 12px;`)}
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

class OFInput extends Component {
    render() {
        const { icon, ...props } = this.props

        return (
            <OFInputWrapper>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <OFInputStyled icon={icon} {...props} />
            </OFInputWrapper>
        )
    }
}

export default OFInput
