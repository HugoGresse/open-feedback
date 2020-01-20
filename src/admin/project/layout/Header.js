import React, { useState } from 'react'
import { COLORS } from '../../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { createMuiTheme, Grid } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TranslateOnScroll from './TranslateOnScroll'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import EyeIcon from '@material-ui/icons/RemoveRedEyeOutlined'
import MenuItem from '@material-ui/core/MenuItem'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
    getSortedProjectsSelector,
} from '../core/projectSelectors'
import { selectProject } from '../core/projectActions'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import RoutingMap from '../../RoutingMap'
import { withRouter } from 'react-router-dom'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { useTranslation } from 'react-i18next'
import makeStyles from '@material-ui/core/styles/makeStyles'

const innerTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

const useStyles = makeStyles({
    appbar: {
        background: COLORS.RED_ORANGE,
    },
    topHeader: {
        marginTop: 20,
        marginBottom: 20,
    },
    topRight: {
        textAlign: 'right',
    },
    topRightButton: {
        background: COLORS.ADMIN_BACKGROUND,
        '&:hover': {
            background: COLORS.ADMIN_BACKGROUND,
            filter: 'brightness(150%)',
        },
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
    const classes = useStyles()
    const dispatch = useDispatch()
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)
    const selectedProject = useSelector(getSelectedProjectSelector)
    const projects = useSelector(getSortedProjectsSelector)
    const { t } = useTranslation()

    const [anchorEventSelect, setAnchorEventSelect] = useState(null)

    const onProjectSelectedChange = projectId => {
        dispatch(selectProject(projectId))
        setAnchorEventSelect(null)
    }

    const handleChangeEventMenuOpen = event => {
        setAnchorEventSelect(event.target)
    }

    const handleMenuClose = () => {
        setAnchorEventSelect(null)
    }

    const getTitle = location => {
        return Object.keys(RoutingMap)
            .filter(key => {
                return location.pathname.includes(RoutingMap[key].url)
            })
            .map(key => RoutingMap[key].name)
    }

    const menuId = 'primary-project-selection-menu'

    return (
        <MuiThemeProvider theme={innerTheme}>
            <TranslateOnScroll refTarget={refTarget}>
                <AppBar position="sticky" className={classes.appbar}>
                    <Toolbar>
                        <Grid container>
                            <Grid item xs={12} className={classes.topHeader}>
                                <Grid container justify="space-between">
                                    <Grid item xs={12} sm={8}>
                                        <Hidden mdUp>
                                            <IconButton
                                                onClick={event =>
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
                                                onClick={event =>
                                                    handleChangeEventMenuOpen(
                                                        event
                                                    )
                                                }>
                                                {selectedProject.name}
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
                                        sm={4}
                                        className={classes.topRight}>
                                        {selectedProject && (
                                            <Button
                                                className={
                                                    classes.topRightButton
                                                }
                                                target="_blank"
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
                                    className={classes.title}>
                                    {getTitle(location)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </TranslateOnScroll>
            <Menu
                anchorEl={anchorEventSelect}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={!!anchorEventSelect}
                onClose={() => handleMenuClose()}>
                {projects.map(project => (
                    <MenuItem
                        key={project.id}
                        onClick={() => onProjectSelectedChange(project.id)}>
                        {project.name}
                    </MenuItem>
                ))}
            </Menu>
        </MuiThemeProvider>
    )
}

export default withRouter(Header)
