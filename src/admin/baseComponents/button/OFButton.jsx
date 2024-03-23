import React from 'react'
import { COLORS } from '../../../constants/colors'
import Button from '@mui/material/Button'
import { darken, alpha, lighten } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        background: (props) =>
            props.design === 'text'
                ? 'none'
                : props.customBg
                ? props.customBg
                : theme.palette[props.color].main,
        color: (props) =>
            props.customText
                ? props.customText
                : props.design === 'text'
                ? theme.primaryText
                : COLORS.WHITE,
        padding: (props) =>
            props.type === 'big'
                ? '12px 32px'
                : props.type === 'small'
                ? '3px 4px'
                : '6px 8px',
        '&:hover': {
            background: (props) =>
                props.design === 'text'
                    ? lighten(alpha(theme.palette[props.color].dark, 1), 0.8)
                    : props.customBg
                    ? darken(props.customBg, 0.2)
                    : theme.palette[props.color].dark,
        },
        '&:disabled': {
            color: (props) => theme.palette[props.color].dark,
        },
    },
    loading: {
        color: 'white',
        marginLeft: 10,
    },
}))

const OFButton = ({ children, loading, color, style, ...otherProps }) => {
    const classes = useStyles({
        color: color || 'primary',
        ...style,
    })

    return (
        <Button
            style={style}
            {...otherProps}
            classes={{
                root: classes.root,
            }}
        >
            {children}
            {loading && (
                <CircularProgress className={classes.loading} size={20} />
            )}
        </Button>
    )
}

export default OFButton
