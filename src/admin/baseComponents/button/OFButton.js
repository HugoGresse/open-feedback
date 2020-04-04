import React from 'react'
import { COLORS } from '../../../constants/colors'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { darken, fade, lighten } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
    root: {
        background: props =>
            props.design === 'text'
                ? 'none'
                : props.customBg
                ? props.customBg
                : COLORS.RED_ORANGE,
        color: props =>
            props.customText
                ? props.customText
                : props.design === 'text'
                ? theme.primaryText
                : COLORS.WHITE,
        padding: props =>
            props.type === 'big'
                ? '12px 32px'
                : props.type === 'small'
                ? '3px 4px'
                : '6px 8px',
        '&:hover': {
            background: props =>
                props.design === 'text'
                    ? lighten(fade(COLORS.DARK_RED_ORANGE, 1), 0.8)
                    : props.customBg
                    ? darken(props.customBg, 0.2)
                    : COLORS.DARK_RED_ORANGE,
        },
        '&:disabled': {
            color: COLORS.DARK_RED_ORANGE,
        },
    },
    loading: {
        color: 'white',
        marginLeft: 10,
    },
}))

const OFButton = ({ children, loading, style, ...otherProps }) => {
    const classes = useStyles(style)

    return (
        <Button
            {...otherProps}
            classes={{
                root: classes.root,
            }}>
            {children}
            {loading && (
                <CircularProgress className={classes.loading} size={20} />
            )}
        </Button>
    )
}

export default OFButton
