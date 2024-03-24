import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-openfeedback-white.png'
import COLORS from '../../constants/colors'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import { signOut } from '../auth/authActions'
import PowerSettingsIcon from '@mui/icons-material/PowerSettingsNew'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSelector } from '../auth/authSelectors'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const useStyles = makeStyles((theme) => ({
    container: {
        background: COLORS.RED_ORANGE,
        padding: 32,
        marginBottom: -300,
        minHeight: 300,
    },
    logo: {
        width: 200,
    },
    left: {
        [theme.breakpoints.down('lg')]: {
            justifyContent: 'center',
            display: 'flex',
        },
    },
    right: {
        display: 'flex',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('lg')]: {
            justifyContent: 'center',
            marginTop: 30,
        },
    },
    user: {
        lineHeight: '40px',
        marginLeft: 12,
        marginRight: 12,
        color: 'white',
    },
    logout: {
        top: -4,
        color: 'white',
    },
}))

const RootHeader = () => {
    const navigate =useNavigate()
    const dispatch = useDispatch()
    const classes = useStyles()

    const user = useSelector(getUserSelector)

    return (
        <header className={classes.container}>
            <Grid container>
                <Grid item xs={12} sm={6} className={classes.left}>
                    <img
                        className={classes.logo}
                        src={logo}
                        alt="open feedback logo"
                    />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.right}>
                    {user.photoURL && <Avatar alt="user" src={user.photoURL} />}
                    <Typography className={classes.user}>
                        {user.displayName}
                    </Typography>
                    <IconButton
                        edge="end"
                        className={classes.logout}
                        aria-label="signout"
                        onClick={() => dispatch(signOut(navigate))}
                        size="large">
                        <PowerSettingsIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </header>
    );
}

export default RootHeader
