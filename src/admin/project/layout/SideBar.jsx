import React from 'react'
import { COLORS } from '../../../constants/colors'
import logo from '../../../assets/logo-openfeedback-color&white.png'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSelector } from '../../auth/authSelectors'
import { signOut } from '../../auth/authActions'
import { createTheme } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
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
import OFMenuItem from './OFMenuItem.jsx'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import RoutingMap from '../../RoutingMap'
import Drawer from '@mui/material/Drawer'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOSSSponsors } from '../../../baseComponents/useOSSSponsors'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const innerTheme = createTheme({
    palette: {
        mode: 'dark',
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
    const navigate = useNavigate()
    const classes = useStyles()
    const { t } = useTranslation()

    const sponsors = useOSSSponsors()

    const user = useSelector(getUserSelector)
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)

    const displayedUserName =
        user.displayName || (user.email.split('@') || [''])[0]

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
                            onClick={(event) => toggleDrawer(event)}
                            subheader={
                                <ListSubheader
                                    component="div"
                                    sx={{ background: 'transparent' }}>
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
                            onClick={(event) => toggleDrawer(event)}
                            subheader={
                                <ListSubheader
                                    component="div"
                                    sx={{ background: 'transparent' }}>
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

                        <List component="nav" className={classes.userBox}>
                            <div className={classes.list}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23555' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                                        ':hover': {
                                            filter: 'brightness(150%)',
                                        },
                                    }}
                                    borderRadius={2}
                                    padding={2}
                                    marginBottom={2}
                                    justifyContent="center"
                                    color="#999"
                                    component="a"
                                    target="_blank"
                                    href="https://github.com/sponsors/HugoGresse">
                                    <Typography>
                                        {t('common.becomeSponsor')}
                                    </Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    justifyContent="space-evenly">
                                    {sponsors.map((sponsor) => (
                                        <Box
                                            component="a"
                                            href={sponsor.website}
                                            target="_blank"
                                            key={sponsor.name}
                                            sx={{
                                                ':hover': { opacity: 0.4 },
                                            }}>
                                            <img
                                                src={
                                                    sponsor.logoDark ||
                                                    sponsor.logo
                                                }
                                                alt={sponsor.name}
                                                style={{
                                                    height: 30,
                                                    borderRadius: 5,
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </div>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={displayedUserName}
                                        src={user.photoURL}
                                    />
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
                                        onClick={() =>
                                            dispatch(signOut(navigate))
                                        }
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
    )
}

export default SideBar
