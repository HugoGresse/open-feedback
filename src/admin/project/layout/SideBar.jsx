import React from 'react'
import { COLORS } from '../../../constants/colors'
import logo from '../../../assets/logo-openfeedback-color&white.png'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSelector } from '../../auth/authSelectors'
import { signOut } from '../../auth/authActions'
import { createTheme, adaptV4Theme } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListSubheader from '@mui/material/ListSubheader'
import EventNoteIcon from '@mui/icons-material/EventNote'
import ExploreIcon from '@mui/icons-material/Explore'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import PeopleIcon from '@mui/icons-material/People'
import PowerSettingsIcon from '@mui/icons-material/PowerSettingsNew'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import SettingsIcon from '@mui/icons-material/Settings'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import CommentIcon from '@mui/icons-material/Comment'
import IconButton from '@mui/material/IconButton'
import DonateIcon from '@mui/icons-material/CardGiftcard'
import OFMenuItem from './OFMenuItem.jsx'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import RoutingMap from '../../RoutingMap'
import Drawer from '@mui/material/Drawer'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ListItemIcon from '@mui/material/ListItemIcon'

const innerTheme = createTheme(adaptV4Theme({
    palette: {
        mode: 'dark',
    },
}))

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
    const navigate = useNavigate()
    const classes = useStyles()
    const { t } = useTranslation()

    const user = useSelector(getUserSelector)
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)

    const displayedUserName = user.displayName || (user.email.split('@') || [""])[0]

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={innerTheme}>
                <Drawer
                    variant={isMobile ? 'temporary' : 'persistent'}
                    open={drawerOpen}
                    onClose={(event) => toggleDrawer(event)}
                    anchor="left"
                    classes={{
                        paper: classes.drawer,
                    }}
                >
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
                            onClick={(event) => toggleDrawer(event)}
                            subheader={
                                <ListSubheader component="div" sx={{background: "transparent"}}>
                                    {t('layout.sidebar.data')}
                                </ListSubheader>
                            }
                        >
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
                            onClick={(event) => toggleDrawer(event)}
                            subheader={
                                <ListSubheader component="div" sx={{background: "transparent"}}>
                                    {t('layout.sidebar.settings')}
                                </ListSubheader>
                            }
                        >
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
                            className={classes.userBox}
                        >
                            <div className={classes.list}>
                                <ListItem
                                    button
                                    component="a"
                                    target="_blank"
                                    href="https://github.com/sponsors/HugoGresse"
                                >
                                    <ListItemIcon className={classes.listItemIcon}>
                                        {<DonateIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primaryTypographyProps={{
                                            color: 'textPrimary',
                                        }}
                                        primary={t('common.donate') + ' 🙏'}
                                    />
                                </ListItem>
                            </div>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt={displayedUserName} src={user.photoURL} />
                                </ListItemAvatar>
                                <ListItemText
                                    primaryTypographyProps={{
                                        color: 'textPrimary',
                                    }}
                                    primary={displayedUserName}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="signout"
                                        onClick={() => dispatch(signOut(navigate))}
                                        size="large">
                                        <PowerSettingsIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default SideBar
