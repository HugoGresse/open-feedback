import React from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles({
    container: {
        padding: 60
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
        marginTop: 102,
        marginBottom: 32
    }
})

const NewProjectLayout = ({title, stepTitle, onCancel, children}) => {
    const classes = useStyles()

    return <Grid container
                 spacing={2}
                 className={classes.container}>
        <Grid item xs={12} sm={2} className={classes.title}>
            <IconButton aria-label="edit" onClick={() => onCancel()}>
                <CloseIcon/>
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

}

export default NewProjectLayout
