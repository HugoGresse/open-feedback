import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import COLORS from '../../constants/colors'
import CardActionArea from '@material-ui/core/CardActionArea'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTranslation } from 'react-i18next'
import OFButton from '../baseComponents/button/OFButton'
import Box from '@material-ui/core/Box'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { useTheme } from '@material-ui/core'

const useStyles = makeStyles(() => ({
    newEventCard: {
        textAlign: 'center',
        color: COLORS.RED_ORANGE,
        '& svg': {
            marginTop: 40,
            marginBottom: 16,
        },
    },
    cardContent: {
        minHeight: 140,
    },
}))

const DEFAULT_PROJECTS_DISPLAY = 5

const ProjectList = ({ projects, onNewEventClick, onProjectSelected }) => {
    const classes = useStyles()
    const theme = useTheme()
    const { t } = useTranslation()
    const [displayedProjects, setDisplayedProjects] = useState(
        projects.slice(0, DEFAULT_PROJECTS_DISPLAY)
    )
    const showHideAllProject = projects.length > DEFAULT_PROJECTS_DISPLAY
    const allProjectsDisplayed = projects.length === displayedProjects.length
    const hiddenProjectCount = projects.length - displayedProjects.length

    return (
        <>
            <Grid item xs={6} sm={6} md={4} key="new-event">
                <Card className={`${classes.newEventCard}`}>
                    <CardActionArea onClick={() => onNewEventClick()}>
                        <CardContent className={classes.cardContent}>
                            <AddIcon />
                            <Typography>{t('root.create')}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            {displayedProjects.map((project) => (
                <Grid item xs={6} sm={6} md={4} key={project.id}>
                    <Card>
                        <CardActionArea
                            onClick={() => onProjectSelected(project.id)}>
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
                    </Card>
                </Grid>
            ))}

            {showHideAllProject && (
                <Grid
                    item
                    xs={12}
                    key="show-all"
                    component={Box}
                    textAlign="end">
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
                            : `${t('common.showAll')} (${hiddenProjectCount})`}
                    </OFButton>
                </Grid>
            )}
        </>
    )
}

export default ProjectList
