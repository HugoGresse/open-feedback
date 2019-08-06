import React, { Component } from 'react'
import { COLORS } from '../../../constants/colors'
import logo from '../../../assets/logo-openfeedback-color&white.png'
import { connect } from 'react-redux'
import { getUserSelector } from '../../auth/authSelectors'
import { didSignIn, signOut } from '../../auth/authActions'
import { createMuiTheme, withStyles } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import EventNoteIcon from '@material-ui/icons/EventNote'
import ExploreIcon from '@material-ui/icons/Explore'
import HowToVoteIcon from '@material-ui/icons/HowToVote'
import PeopleIcon from '@material-ui/icons/People'
import PowerSettingsIcon from '@material-ui/icons/PowerSettingsNew'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import SettingsIcon from '@material-ui/icons/Settings'
import SlideshowIcon from '@material-ui/icons/Slideshow'
import IconButton from '@material-ui/core/IconButton'
import { authProvider } from '../../../firebase'
import OFMenuItem from './OFMenuItem'

const innerTheme = createMuiTheme({
    palette: {
        type: 'dark'
    }
})

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.ADMIN_BACKGROUND,
        height: '100vh',
        minWidth: '220px',
        [theme.breakpoints.up(900 + theme.spacing(6))]: {
            width: 300
        },
        '& .active': {
            background: COLORS.RED_ORANGE
        }
    },
    list: {
        padding: 15,
        '& > a': {
            borderRadius: 2
        }
    },
    listItemText: {
        paddingLeft: 0
    },
    logoContainer: {
        justifyContent: 'center'
    },
    logo: {
        width: '80%',
        maxWidth: '150px'
    },
    header: {
        textAlign: 'left'
    },
    userBox: {
        marginTop: 'auto'
    }
})

class SideBar extends Component {
    render() {
        const { classes, user, match } = this.props

        const userName =
            user.providerData[0] && user.providerData[0].displayName

        return (
            <MuiThemeProvider theme={innerTheme}>
                <div className={classes.container}>
                    <List component="nav">
                        <ListItem className={classes.logoContainer}>
                            <img
                                className={classes.logo}
                                src={logo}
                                alt="open feedback logo"
                            />
                        </ListItem>
                        <Divider />
                    </List>

                    <List
                        component="nav"
                        aria-label="main toto tutu"
                        className={classes.list}
                        subheader={
                            <ListSubheader
                                component="div"
                                className={classes.header}
                            >
                                DATA
                            </ListSubheader>
                        }
                    >
                        <OFMenuItem
                            to={`${match.url}/dashboard`}
                            icon={<ExploreIcon />}
                            text="Dashboard"
                            textClassName={classes.listItemText}
                        />

                        <OFMenuItem
                            to={`${match.url}/talks`}
                            text="Talks"
                            icon={<SlideshowIcon />}
                            textClassName={classes.listItemText}
                        />

                        <OFMenuItem
                            to={`${match.url}/speakers`}
                            icon={<RecordVoiceOverIcon />}
                            text="Speakers"
                            textClassName={classes.listItemText}
                        />
                    </List>
                    <Divider />

                    <List
                        component="nav"
                        aria-label="main toto tutu"
                        className={classes.list}
                        subheader={
                            <ListSubheader
                                component="div"
                                className={classes.header}
                            >
                                SETTINGS
                            </ListSubheader>
                        }
                    >
                        <OFMenuItem
                            text="Event & Theme"
                            textClassName={classes.listItemText}
                            icon={<EventNoteIcon />}
                            to={`${match.url}/settings/event`}
                        />
                        <OFMenuItem
                            text="Voting Form"
                            textClassName={classes.listItemText}
                            icon={<HowToVoteIcon />}
                            to={`${match.url}/settings/votingform`}
                        />
                        <OFMenuItem
                            text="Setup"
                            textClassName={classes.listItemText}
                            icon={<SettingsIcon />}
                            to={`${match.url}/settings/setup`}
                        />
                        <OFMenuItem
                            text="Users"
                            textClassName={classes.listItemText}
                            icon={<PeopleIcon />}
                            to={`${match.url}/settings/users`}
                        />
                    </List>
                    <Divider />

                    <List
                        component="nav"
                        aria-label="something"
                        className={classes.userBox}
                    >
                        <ListItem>
                            <ListItemAvatar>
                                {user.providerData[0] && (
                                    <Avatar
                                        alt="user"
                                        src={user.providerData[0].photoURL}
                                    />
                                )}
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: 'textPrimary'
                                }}
                                primary={userName}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="signout"
                                    onClick={() => authProvider.signOut()}
                                >
                                    <PowerSettingsIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </div>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({
    user: getUserSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        didSignIn: didSignIn,
        signOut: signOut
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SideBar))
