import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import CardActionArea from '@material-ui/core/CardActionArea'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTranslation } from 'react-i18next'
import OFButton from '../baseComponents/button/OFButton'
import Box from '@material-ui/core/Box'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { useTheme } from '@material-ui/core'
import { Link } from 'react-router-dom'
import RoutingMap, { ROUTE_EVENT_BASE } from '../RoutingMap'

const useStyles = makeStyles((theme) => ({
    newEventCard: {
        textAlign: 'center',
        color: (props) =>
            props.invertedColor
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
        '& svg': {
            marginTop: 40,
            marginBottom: 16,
        },
    },
    cardActionArea: {
        color: theme.palette.text.primary,
    },
    newProjectCard: {
        color: (props) =>
            props.invertedColor
                ? theme.palette.secondary.dark
                : theme.palette.primary.dark,
        minHeight: 140,
    },
    cardContent: {
        minHeight: 140,
    },
}))

const DEFAULT_PROJECTS_DISPLAY = 5

const ProjectList = ({
    projects,
    organizationId,
    onNewEventClick,
    invertedColor,
}) => {
    const classes = useStyles({ invertedColor })
    const theme = useTheme()
    const { t } = useTranslation()
    const [displayedProjects, setDisplayedProjects] = useState([])
    const showHideAllProject = projects.length > DEFAULT_PROJECTS_DISPLAY
    const allProjectsDisplayed = projects.length === displayedProjects.length
    const hiddenProjectCount = projects.length - displayedProjects.length

    useEffect(() => {
        setDisplayedProjects(projects.slice(0, DEFAULT_PROJECTS_DISPLAY))
    }, [projects])

    return (
        <>
            <Grid item xs={6} sm={6} md={4} key="new-event" component="li">
                <Card className={`${classes.newEventCard}`}>
                    <CardActionArea
                        onClick={() => onNewEventClick(organizationId)}>
                        <CardContent className={classes.newProjectCard}>
                            <AddIcon />
                            <Typography>{t('root.create')}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            {displayedProjects.map((project) => (
                <Grid item xs={6} sm={6} md={4} key={project.id} component="li">
                    <Card>
                        <Link
                            to={`${ROUTE_EVENT_BASE}/${project.id}${RoutingMap.dashboard.url}`}
                            title={`${t('root.selectEvent')}${project.name}`}>
                            <CardActionArea className={classes.cardActionArea}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant="h6">
                                        {project.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary">
                                        {project.id}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Link>
                    </Card>
                </Grid>
            ))}

            {showHideAllProject && (
                <Grid item xs={12} key="show-all" component="li">
                    <Box textAlign="end">
                        <OFButton
                            onClick={() => {
                                setDisplayedProjects(
                                    allProjectsDisplayed
                                        ? projects.slice(
                                              0,
                                              DEFAULT_PROJECTS_DISPLAY
                                          )
                                        : projects
                                )
                            }}
                            style={{
                                customBg:
                                    theme.palette.secondary
                                        .buttonSecondaryBackground,
                                customText:
                                    theme.palette.secondary.buttonSecondaryText,
                            }}>
                            {allProjectsDisplayed ? (
                                <ExpandLessIcon />
                            ) : (
                                <ExpandMoreIcon />
                            )}
                            {allProjectsDisplayed
                                ? t('common.showLess')
                                : `${t(
                                      'common.showAll'
                                  )} (${hiddenProjectCount})`}
                        </OFButton>
                    </Box>
                </Grid>
            )}
        </>
    )
}

export default ProjectList
