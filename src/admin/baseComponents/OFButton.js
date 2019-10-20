import React from 'react'
import { COLORS } from '../../constants/colors'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
    root: {
        background: COLORS.RED_ORANGE,
        color: COLORS.WHITE,
        padding: props => props.type === "big" ? '12px 32px' : '6px 8px',
        '&:hover': {
            background: COLORS.DARK_RED_ORANGE
        },
        '&:disabled': {
            color: COLORS.DARK_RED_ORANGE
        }
    }
})

const OFButton = props => {
    const classes = useStyles(props.style)

    return (
        <Button
            {...props}
            classes={{
                root: classes.root
            }}
        />
    )
}

export default OFButton
