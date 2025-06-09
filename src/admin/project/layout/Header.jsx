import React, { useState } from 'react'
import { COLORS } from '../../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { createTheme, Grid } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import MenuItem from '@mui/material/MenuItem'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
    getSortedProjectsSelector,
} from '../core/projectSelectors'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import RoutingMap from '../../RoutingMap'
import { useNavigate, useLocation } from 'react-router-dom'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTranslation } from 'react-i18next'
import Icon from '@mui/material/Icon'
import { redirectToProject } from '../utils/redirectToProject'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Translate from './Translate.jsx'
import Help from './Help.jsx'
import { getProjects } from '../core/actions/getProjects'
import { getOrganizations } from '../../organization/core/actions/getOrganizations'
import { getSelectedOrganizationSelector } from '../../organization/core/organizationSelectors'
import { QRCodeDialog } from '../../../baseComponents/QRCodeDialog'
import QrCodeIcon from '@mui/icons-material/QrCode'

const innerTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#fff',
            contrastText: '#fff',
        },
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
        color: COLORS.WHITE,
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
    },
})

const Header = ({ refTarget, toggleDrawer }) => {
    const location = useLocation()
    const dispatch = useDispatch()
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)
    const selectedProject = useSelector(getSelectedProjectSelector)
    const projects = useSelector(getSortedProjectsSelector)
    const selectedOrganization = useSelector(getSelectedOrganizationSelector)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [anchorEventSelect, setAnchorEventSelect] = useState(null)
    const [qrCodeDialogOpen, setQRCodeDialogOpen] = useState(false)
    const trigger = useScrollTrigger({ target: refTarget || window })
    const triggerScrollShadow = useScrollTrigger({
        target: refTarget || window,
        disableHysteresis: true,
    })
    const classes = useStyles({ shadow: triggerScrollShadow })

    const onProjectSelectedChange = (projectId) => {
        redirectToProject(selectedProjectId, projectId, navigate)
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
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={innerTheme}>
                    <Translate in={!trigger}>
                        <AppBar position="sticky" className={classes.appbar}>
                            <Toolbar>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.topHeader}>
                                        <Grid
                                            container
                                            justifyContent="space-between">
                                            <Grid item xs={12} sm={7}>
                                                <Hidden mdUp>
                                                    <IconButton
                                                        onClick={(event) =>
                                                            toggleDrawer(event)
                                                        }
                                                        size="large">
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
                                                    <IconButton
                                                        className={
                                                            classes.topRightButtonLight
                                                        }
                                                        onClick={() =>
                                                            setQRCodeDialogOpen(
                                                                true
                                                            )
                                                        }>
                                                        <QrCodeIcon />
                                                    </IconButton>
                                                )}

                                                {selectedProject && (
                                                    <Button
                                                        className={
                                                            classes.topRightButton
                                                        }
                                                        target="_blank"
                                                        title={t(
                                                            'layout.seeEvent'
                                                        )}
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
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={!!anchorEventSelect}
                        onClose={() => handleMenuClose()}
                        TransitionProps={{
                            onEnter: () => {
                                if (projects.length === 1) {
                                    dispatch(getProjects())
                                    dispatch(getOrganizations())
                                }
                            },
                        }}>
                        {projects.map((project) => (
                            <MenuItem
                                key={project.id}
                                onClick={() =>
                                    onProjectSelectedChange(project.id)
                                }>
                                {project.name}{' '}
                                {project.organizationId &&
                                    `(${project.organizationName})`}
                            </MenuItem>
                        ))}
                    </Menu>
                </ThemeProvider>
            </StyledEngineProvider>
            <QRCodeDialog
                open={qrCodeDialogOpen}
                onClose={() => setQRCodeDialogOpen(false)}
                title={selectedProject.name}
                value={`${window.location.origin}/${selectedProjectId}`}
                fileName={selectedProject.name.trim() + '-qr-code-openfeedback'}
                logo={selectedProject.logoSmall}
            />
        </>
    )
}

export default Header
