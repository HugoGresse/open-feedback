import React from 'react'
import logo from '../../assets/logo-openfeedback-white.png'
import COLORS from '../../constants/colors'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import {signOut} from '../auth/authActions'
import PowerSettingsIcon from '@material-ui/icons/PowerSettingsNew'
import {useDispatch, useSelector} from 'react-redux'
import {getUserSelector} from '../auth/authSelectors'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {Box} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
    container: {
        background: COLORS.RED_ORANGE,
        padding: 32,
        marginBottom: -300,
        minHeight: 300,
    },
    logo: {
        width: 200
    },
    user: {
        lineHeight: "40px",
        marginLeft: 12,
        marginRight: 12,
        color: 'white'
    },
    logout: {
        top: -4,
        color: 'white'
    }
})

const RootHeader = () => {
    const dispatch = useDispatch()
    const classes = useStyles()

    const user = useSelector(getUserSelector)

    return (
        <div className={classes.container}>
            <Box display="flex" justifyContent="space-between">

                <img className={classes.logo} src={logo} alt="open feedback logo" />
                <Box display="flex">
                    {user.photoURL && <Avatar
                        alt="user"
                        src={user.photoURL}
                    />}
                    <Typography className={classes.user}>{user.displayName}</Typography>
                    <IconButton
                        edge="end"
                        className={classes.logout}
                        aria-label="signout"
                        onClick={() => dispatch(signOut())}
                    >
                        <PowerSettingsIcon />
                    </IconButton>
                </Box>
            </Box>
        </div>
    )
}

export default RootHeader
