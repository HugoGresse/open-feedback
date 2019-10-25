import React, { useEffect, useState } from 'react'
import {
    getSortedProjectsSelector,
    isProjectsLoadedSelector
} from '../project/core/projectSelectors'
import { connect } from 'react-redux'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import { getProjects, selectProject } from '../project/core/projectActions'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import RootHeader from './RootHeader'
import { Box, Slide } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import COLORS from '../../constants/colors'
import Paper from '@material-ui/core/Paper'
import RootContent from './RootContent'
import NewProject from '../project/new/NewProject'

const styles = theme => ({
    container: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: '100vh',
        overflow: 'hidden'
    },
    projectContainer: {
        paddingBottom: theme.spacing(2)
    },
    title: {
        marginTop: 100,
        marginBottom: 20,
        color: COLORS.WHITE
    },
    loaderContainer: {
        padding: theme.spacing(2, 2)
    },
    newProjectContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        overflow: 'hidden'
    }
})

function AdminRoot({
    getProjects,
    projects,
    isProjectsLoaded,
    selectProject,
    classes
}) {
    useEffect(() => {
        getProjects()
    }, [getProjects])

    const [isNewProjectOpen, setNewProjectOpen] = useState(false)

    return (
        <div style={{ position: 'relative' }}>
            <Box
                className={classes.container}
                style={{ height: isNewProjectOpen ? '100vh' : 'auto' }}
            >
                <RootHeader />
                <Container
                    maxWidth="md"
                    fixed
                    className={classes.projectContainer}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography
                                className={classes.title}
                                variant="h4"
                                gutterBottom
                            >
                                Your OpenFeedback events
                            </Typography>
                        </Grid>

                        {isProjectsLoaded && (
                            <RootContent
                                projects={projects}
                                onNewEventClick={() => setNewProjectOpen(true)}
                                onProjectSelected={projectId =>
                                    selectProject(projectId)
                                }
                            />
                        )}

                        {!isProjectsLoaded && (
                            <Paper className={classes.loaderContainer}>
                                <LoaderMatchParent height="50" />
                            </Paper>
                        )}
                    </Grid>
                </Container>
            </Box>

            <div className={classes.newProjectContainer}>
                <Slide
                    direction="left"
                    mountOnEnter={true}
                    unmountOnExit={true}
                    in={isNewProjectOpen}
                    timeout={500}
                >
                    <div>
                        <NewProject onCancel={() => setNewProjectOpen(false)} />
                    </div>
                </Slide>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    projects: getSortedProjectsSelector(state),
    isProjectsLoaded: isProjectsLoadedSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProjects: getProjects,
        selectProject: selectProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AdminRoot))
