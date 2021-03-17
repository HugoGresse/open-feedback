import React, { useState } from 'react'
import { COLORS } from '../../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { createMuiTheme, Grid } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import EyeIcon from '@material-ui/icons/RemoveRedEyeOutlined'
import MenuItem from '@material-ui/core/MenuItem'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
    getSortedProjectsSelector,
} from '../core/projectSelectors'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import RoutingMap from '../../RoutingMap'
import { withRouter, useHistory } from 'react-router-dom'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { useTranslation } from 'react-i18next'
import makeStyles from '@material-ui/core/styles/makeStyles'
import QRCode from './svg/qrcode.svg'
import Icon from '@material-ui/core/Icon'
import QRCodeDialog from './QRCodeDialog'
import { redirectToProject } from '../utils/redirectToProject'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Translate from './Translate'
import Help from './Help'
import { getProjects } from '../core/actions/getProjects'
import { getOrganizations } from '../../organization/core/actions/getOrganizations'
import { getSelectedOrganizationSelector } from '../../organization/core/organizationSelectors'

const innerTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

const useStyles = makeStyles({
    appbar: {
        background: COLORS.RED_ORANGE,
        boxShadow: (props) => (props.shadow ? null : 'none'),
    },
    topHeader: {
        marginTop: 20,
        marginBottom: 20,
    },
    topRight: {
        textAlign: 'right',
    },
    topRightButton: {
        marginLeft: 10,
        background: COLORS.ADMIN_BACKGROUND,
        '&:hover': {
            background: COLORS.ADMIN_BACKGROUND,
            filter: 'brightness(150%)',
        },
    },
    topRightButtonLight: {
        '&:hover': {
            background: COLORS.ADMIN_BACKGROUND,
            filter: 'brightness(150%)',
        },
        minWidth: 0,
        lineHeight: 1,
    },
    topRightIcon: {
        marginRight: 10,
    },
    selectIcon: {
        marginLeft: 10,
    },
    changeEventButton: {
        textTransform: 'none',
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
    },
})

const Header = ({ refTarget, location, toggleDrawer }) => {
    const dispatch = useDispatch()
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)
    const selectedProject = useSelector(getSelectedProjectSelector)
    const projects = useSelector(getSortedProjectsSelector)
    const selectedOrganization = useSelector(getSelectedOrganizationSelector)
    const { t } = useTranslation()
    const history = useHistory()

    const [anchorEventSelect, setAnchorEventSelect] = useState(null)
    const [qrCodeDialogOpen, setQRCodeDialogOpen] = useState(false)
    const trigger = useScrollTrigger({ target: refTarget || window })
    const triggerScrollShadow = useScrollTrigger({
        target: refTarget || window,
        disableHysteresis: true,
    })
    const classes = useStyles({ shadow: triggerScrollShadow })

    const onProjectSelectedChange = (projectId) => {
        redirectToProject(selectedProjectId, projectId, history)
        setAnchorEventSelect(null)
    }

    const handleChangeEventMenuOpen = (event) => {
        setAnchorEventSelect(event.target)
    }

    const handleMenuClose = () => {
        setAnchorEventSelect(null)
    }

    const getTitle = (location) => {
        return Object.keys(RoutingMap)
            .filter((key) => {
                return location.pathname.includes(RoutingMap[key].url)
            })
            .map((key) => t(RoutingMap[key].i18key))
    }

    const menuId = 'primary-project-selection-menu'

    return (
        <>
            <MuiThemeProvider theme={innerTheme}>
                <Translate in={!trigger}>
                    <AppBar position="sticky" className={classes.appbar}>
                        <Toolbar>
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.topHeader}>
                                    <Grid container justify="space-between">
                                        <Grid item xs={12} sm={7}>
                                            <Hidden mdUp>
                                                <IconButton
                                                    onClick={(event) =>
                                                        toggleDrawer(event)
                                                    }>
                                                    <MenuIcon />
                                                </IconButton>
                                            </Hidden>

                                            {selectedProject && (
                                                <Button
                                                    aria-label="change event"
                                                    aria-controls={menuId}
                                                    aria-haspopup="true"
                                                    className={
                                                        classes.changeEventButton
                                                    }
                                                    onClick={(event) =>
                                                        handleChangeEventMenuOpen(
                                                            event
                                                        )
                                                    }>
                                                    {selectedProject.name}
                                                    {selectedOrganization &&
                                                        ` (${selectedOrganization.name})`}
                                                    <ArrowDownIcon
                                                        className={
                                                            classes.selectIcon
                                                        }
                                                    />
                                                </Button>
                                            )}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={5}
                                            className={classes.topRight}>
                                            <Help
                                                buttonClass={
                                                    classes.topRightButtonLight
                                                }
                                            />

                                            {selectedProject && (
                                                <Button
                                                    className={
                                                        classes.topRightButtonLight
                                                    }
                                                    onClick={() =>
                                                        setQRCodeDialogOpen(
                                                            true
                                                        )
                                                    }>
                                                    <Icon>
                                                        <img
                                                            src={QRCode}
                                                            alt="QRCode generator"
                                                        />
                                                    </Icon>
                                                </Button>
                                            )}

                                            {selectedProject && (
                                                <Button
                                                    className={
                                                        classes.topRightButton
                                                    }
                                                    target="_blank"
                                                    title={t('layout.seeEvent')}
                                                    href={`/${selectedProjectId}`}>
                                                    <EyeIcon
                                                        className={
                                                            classes.topRightIcon
                                                        }
                                                    />
                                                    {t('layout.seeEvent')}
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        className={classes.title}>
                                        {getTitle(location)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </Translate>
                <Menu
                    anchorEl={anchorEventSelect}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    id={menuId}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={!!anchorEventSelect}
                    onEnter={() => {
                        if (projects.length === 1) {
                            dispatch(getProjects())
                            dispatch(getOrganizations())
                        }
                    }}
                    onClose={() => handleMenuClose()}>
                    {projects.map((project) => (
                        <MenuItem
                            key={project.id}
                            onClick={() => onProjectSelectedChange(project.id)}>
                            {project.name}{' '}
                            {project.organizationId &&
                                `(${project.organizationName})`}
                        </MenuItem>
                    ))}
                </Menu>
            </MuiThemeProvider>
            <QRCodeDialog
                open={qrCodeDialogOpen}
                handleClose={() => setQRCodeDialogOpen(false)}
                name={selectedProject.name}
                data={`${window.location.origin}/${selectedProjectId}`}
            />
        </>
    )
}

export default withRouter(Header)
