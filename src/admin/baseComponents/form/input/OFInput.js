import React from 'react'
import styled from 'styled-components'
import { fontSize, fontWeight, space } from 'styled-system'
import { COLORS } from '../../../../constants/colors'
import InputBase from '@material-ui/core/InputBase'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTheme } from '@material-ui/core/styles'

const IconWrapper = styled.div`
    position: absolute;
    top: 17px;
    left: 10px;
`

const OFInputStyled = styled(InputBase)`
    height: 40px;
    font-size: 16px;
    ${(props) =>
        props.error ? `border: 1px solid #F00;` : `border: 1px solid #EEE;`}
    ${(props) =>
        props.error ? `box-shadow: 0px 1px 3px rgba(255,0,0, 0.3);` : ``}
    width: 100%;
    background: ${COLORS.WHITE};
    border-radius: 2px;
    box-sizing: border-box;
    ${fontSize}
    ${fontWeight}
    ${space}
    color:${COLORS.DARK_GRAY};

    &::placeholder {
        color: ${COLORS.LIGHT_GRAY};
    }
    &::selected {
        background-color: 'transparent';
    }
    &:focus-within {
        ${(props) => `border: 1px solid ${props.primaryColor};`}
    }
`

const useStyles = makeStyles({
    selectedInput: {
        paddingLeft: 12,
        '&:-internal-autofill-selected': {
            backgroundColor: 'transparent',
        },
    },
})

function OFInput(props) {
    const classes = useStyles()
    const theme = useTheme()

    const { forwardedRef, ...otherProps } = props

    return (
        <>
            {otherProps.icon && <IconWrapper>{otherProps.icon}</IconWrapper>}
            <OFInputStyled
                classes={{
                    input: classes.selectedInput,
                }}
                ref={forwardedRef}
                primaryColor={theme.palette.primary.main}
                {...otherProps}
            />
        </>
    )
}

export default OFInput
