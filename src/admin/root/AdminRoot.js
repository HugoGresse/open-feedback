import React, { useEffect } from 'react'
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
import { Box } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import COLORS from '../../constants/colors'
import Config from '../../config'
import Paper from '@material-ui/core/Paper'
import RootContent from './RootContent'

const styles = theme => ({
    container: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: '100vh'
    },
    title: {
        marginTop: 100,
        marginBottom: 20,
        color: COLORS.WHITE
    },
    loaderContainer: {
        padding: theme.spacing(2, 2)
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

    return (
        <Box className={classes.container}>
            <RootHeader />
            <Container maxWidth="md" fixed>
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
                            onNewEventClick={() =>
                                alert(
                                    `Creating new event can only be done by the admin for the moment. Contact ${Config.adminAddress} to create it (should be pretty fast).`
                                )
                            }
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
