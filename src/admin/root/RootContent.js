import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import COLORS from '../../constants/colors'
import CardActionArea from '@material-ui/core/CardActionArea'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
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
})

const RootContent = ({ projects, onNewEventClick, onProjectSelected }) => {
    const classes = useStyles()
    return (
        <>
            <Grid item xs={6} sm={6} md={4} key="new-event">
                <Card className={`${classes.newEventCard}`}>
                    <CardActionArea onClick={() => onNewEventClick()}>
                        <CardContent className={classes.cardContent}>
                            <AddIcon />
                            <Typography>Create a new event</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            {projects.map(project => (
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
        </>
    )
}

export default RootContent
