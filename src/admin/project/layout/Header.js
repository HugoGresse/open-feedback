import React, { Component } from 'react'
import { COLORS } from '../../../constants/colors'
import { connect } from 'react-redux'
import { createMuiTheme, Grid, withStyles } from '@material-ui/core'
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
    getSortedProjectsSelector
} from '../core/projectSelectors'
import { selectProject } from '../core/projectActions'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import RoutingMap from '../../RoutingMap'
import { withRouter } from 'react-router-dom'

const innerTheme = createMuiTheme({
    palette: {
        type: 'dark'
    }
})

const styles = () => ({
    appbar: {
        background: COLORS.RED_ORANGE,
        textAlign: 'left'
    },
    topHeader: {
        marginTop: 20,
        marginBottom: 20
    },
    topRight: {
        textAlign: 'right'
    },
    topRightButton: {
        background: COLORS.ADMIN_BACKGROUND,
        '&:hover': {
            background: COLORS.ADMIN_BACKGROUND,
            filter: 'brightness(150%)'
        }
    },
    topRightIcon: {
        marginRight: 10
    },
    selectIcon: {
        marginLeft: 10
    },
    changeEventButton: {
        textTransform: 'none'
    },
    title: {
        marginTop: 20,
        marginBottom: 20
    }
})

class Header extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            anchorEventSelect: null
        }
    }

    onProjectSelectedChange(projectId) {
        this.props.selectProject(projectId)
        this.setState({
            anchorEventSelect: null
        })
    }

    handleChangeEventMenuOpen(event) {
        this.setState({
            anchorEventSelect: event.target
        })
    }

    handleMenuClose() {
        this.setState({
            anchorEventSelect: null
        })
    }

    getTitle(location) {
        return Object.keys(RoutingMap)
            .filter(key => {
                return location.pathname.includes(RoutingMap[key].url)
            })
            .map(key => RoutingMap[key].name)
    }

    render() {
        const {
            classes,
            refTarget,
            projects,
            selectedProject,
            selectedProjectId,
            location
        } = this.props

        const menuId = 'primary-search-account-menu'

        // TODO : selectedProject should always be true after router refacto, remove those
        return (
            <MuiThemeProvider theme={innerTheme}>
                <TranslateOnScroll refTarget={refTarget}>
                    <AppBar position="sticky" className={classes.appbar}>
                        <Toolbar>
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.topHeader}
                                >
                                    <Grid container justify="space-between">
                                        <Grid item xs={12} sm={8}>
                                            {selectedProject && (
                                                <Button
                                                    aria-label="change event"
                                                    aria-controls={menuId}
                                                    aria-haspopup="true"
                                                    className={
                                                        classes.changeEventButton
                                                    }
                                                    onClick={event =>
                                                        this.handleChangeEventMenuOpen(
                                                            event
                                                        )
                                                    }
                                                >
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
                                            className={classes.topRight}
                                        >
                                            {selectedProject && (
                                                <Button
                                                    className={
                                                        classes.topRightButton
                                                    }
                                                    target="_blank"
                                                    href={`https://openfeedback.io/${selectedProjectId}`}
                                                >
                                                    <EyeIcon
                                                        className={
                                                            classes.topRightIcon
                                                        }
                                                    />
                                                    See event
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h5"
                                        className={classes.title}
                                    >
                                        {this.getTitle(location)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </TranslateOnScroll>
                <Menu
                    anchorEl={this.state.anchorEventSelect}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    id={menuId}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={!!this.state.anchorEventSelect}
                    onClose={() => this.handleMenuClose()}
                >
                    {projects.map(project => (
                        <MenuItem
                            key={project.id}
                            onClick={() =>
                                this.onProjectSelectedChange(project.id)
                            }
                        >
                            {project.name}
                        </MenuItem>
                    ))}
                </Menu>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({
    selectedProjectId: getSelectedProjectIdSelector(state),
    selectedProject: getSelectedProjectSelector(state),
    projects: getSortedProjectsSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        selectProject: selectProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(withRouter(Header)))
