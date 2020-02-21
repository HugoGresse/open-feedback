import React from 'react'
import { COLORS } from '../../../constants/colors'
import logo from '../../../assets/logo-openfeedback-color&white.png'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSelector } from '../../auth/authSelectors'
import { signOut } from '../../auth/authActions'
import { createMuiTheme } from '@material-ui/core'
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
import CommentIcon from '@material-ui/icons/Comment'
import IconButton from '@material-ui/core/IconButton'
import OFMenuItem from './OFMenuItem'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import RoutingMap from '../../RoutingMap'
import Drawer from '@material-ui/core/Drawer'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const innerTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.ADMIN_BACKGROUND,
        height: '100vh',
        minWidth: '220px',
        '& .active': {
            background: COLORS.RED_ORANGE,
        },
    },
    drawer: {
        position: 'relative',
        width: 270,
    },
    list: {
        padding: 15,
        '& > a': {
            borderRadius: 2,
        },
    },
    listItemIcon: {
        minWidth: 40,
    },
    logoContainer: {
        justifyContent: 'center',
    },
    logo: {
        width: '80%',
        maxWidth: 170,
        marginTop: 10,
        marginBottom: 10,
    },
    userBox: {
        marginTop: 'auto',
    },
})

const SideBar = ({ baseUrl, drawerOpen, toggleDrawer, isMobile }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { t } = useTranslation()

    const user = useSelector(getUserSelector)
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)

    return (
        <MuiThemeProvider theme={innerTheme}>
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={event => toggleDrawer(event)}
                anchor="left"
                classes={{
                    paper: classes.drawer,
                }}>
                <div className={classes.container}>
                    <List component="nav">
                        <ListItem className={classes.logoContainer}>
                            <Link to="/admin/">
                                <img
                                    className={classes.logo}
                                    src={logo}
                                    alt="open feedback logo"
                                />
                            </Link>
                        </ListItem>
                        <Divider />
                    </List>

                    <List
                        component="nav"
                        aria-label="Main menu"
                        className={classes.list}
                        onClick={event => toggleDrawer(event)}
                        subheader={
                            <ListSubheader component="div">
                                {t('layout.sidebar.data')}
                            </ListSubheader>
                        }>
                        <OFMenuItem
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.dashboard.url}`}
                            icon={<ExploreIcon />}
                            text={t(RoutingMap.dashboard.i18key)}
                            iconClassName={classes.listItemIcon}
                        />
                        <OFMenuItem
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.talks.url}`}
                            text={t(RoutingMap.talks.i18key)}
                            icon={<SlideshowIcon />}
                            iconClassName={classes.listItemIcon}
                        />
                        <OFMenuItem
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.speakers.url}`}
                            icon={<RecordVoiceOverIcon />}
                            text={t(RoutingMap.speakers.i18key)}
                            iconClassName={classes.listItemIcon}
                        />
                        <OFMenuItem
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.moderation.url}`}
                            icon={<CommentIcon />}
                            text={t(RoutingMap.moderation.i18key)}
                            iconClassName={classes.listItemIcon}
                        />
                    </List>
                    <Divider />

                    <List
                        component="nav"
                        aria-label="Settings menu"
                        className={classes.list}
                        onClick={event => toggleDrawer(event)}
                        subheader={
                            <ListSubheader component="div">
                                {t('layout.sidebar.settings')}
                            </ListSubheader>
                        }>
                        <OFMenuItem
                            text={t(RoutingMap.settingEvent.i18key)}
                            iconClassName={classes.listItemIcon}
                            icon={<EventNoteIcon />}
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.settingEvent.url}`}
                        />
                        <OFMenuItem
                            text={t(RoutingMap.settingVotingform.i18key)}
                            iconClassName={classes.listItemIcon}
                            icon={<HowToVoteIcon />}
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.settingVotingform.url}`}
                        />
                        <OFMenuItem
                            text={t(RoutingMap.settingSetup.i18key)}
                            iconClassName={classes.listItemIcon}
                            icon={<SettingsIcon />}
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.settingSetup.url}`}
                        />
                        <OFMenuItem
                            text={t(RoutingMap.settingUsers.i18key)}
                            iconClassName={classes.listItemIcon}
                            icon={<PeopleIcon />}
                            to={`${baseUrl}/${selectedProjectId}${RoutingMap.settingUsers.url}`}
                        />
                    </List>
                    <Divider />

                    <List
                        component="nav"
                        aria-label="user/logout"
                        className={classes.userBox}>
                        <ListItem>
                            {user.photoURL && (
                                <ListItemAvatar>
                                    <Avatar alt="user" src={user.photoURL} />
                                </ListItemAvatar>
                            )}
                            <ListItemText
                                primaryTypographyProps={{
                                    color: 'textPrimary',
                                }}
                                primary={user.displayName}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="signout"
                                    onClick={() => dispatch(signOut())}>
                                    <PowerSettingsIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </MuiThemeProvider>
    )
}

export default SideBar
