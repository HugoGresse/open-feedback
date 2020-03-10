import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../constants/colors'

const useStyles = makeStyles(() => ({
    container: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: 0,
        transition: 'all 1s ease-in',
        animation: '1s $appearDelayed',
        animationDelay: '500ms',
        animationFillMode: 'forwards',
        width: props => props.width,
        height: props => props.height,
        maxWidth: props => props.maxWidth,
        '& > div': {
            color: COLORS.RED_ORANGE,
        },
    },

    '@keyframes appearDelayed': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
}))

const LoaderMatchParent = ({
    height = '100vh',
    width = '100%',
    style = {},
    maxWidth = undefined,
}) => {
    const classes = useStyles({
        height,
        width,
        maxWidth,
    })
    return (
        <div className={classes.container}>
            <CircularProgress style={style} />
        </div>
    )
}

export default LoaderMatchParent
