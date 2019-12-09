import React, { Component } from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight, height, space, width } from 'styled-system'
import { COLORS } from '../../../constants/colors'

const OFTextAreaWrapper = styled.div`
    ${width}
    ${height}

    position: relative;
`

const IconWrapper = styled.div`
    position: absolute;
    top: 17px;
    left: 10px;
`

const OFTextAreaStyled = styled.textarea`
    height: 100%;
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

class OFTextArea extends Component {
    render() {
        const { icon, ...props } = this.props

        return (
            <OFTextAreaWrapper {...props}>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <OFTextAreaStyled icon={icon} {...props} />
            </OFTextAreaWrapper>
        )
    }
}

export default OFTextArea
