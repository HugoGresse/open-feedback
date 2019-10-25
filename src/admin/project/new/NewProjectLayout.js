import React from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(7),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4)
        }
    },
    title: {
        textAlign: 'right'
    },
    newProjectTitle: {
        marginTop: 8,
        fontSize: 32
    },
    stepName: {
        fontSize: 44,
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(3),

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(2)
        }
    }
}))

const NewProjectLayout = ({ title, stepTitle, onCancel, children }) => {
    const classes = useStyles()

    return (
        <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} sm={2} className={classes.title}>
                <IconButton aria-label="edit" onClick={() => onCancel()}>
                    <CloseIcon />
                </IconButton>
            </Grid>

            <Grid item xs={12} sm={10}>
                <Typography variant="h2" className={classes.newProjectTitle}>
                    {stepTitle}
                </Typography>

                <Typography variant="h3" className={classes.stepName}>
                    {title}
                </Typography>

                {children}
            </Grid>
        </Grid>
    )
}

export default NewProjectLayout
