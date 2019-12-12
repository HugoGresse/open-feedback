import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../constants/colors'

const useStyles = makeStyles(theme => ({
    container: {
        paddingBottom: theme.spacing(2),
    },
    title: {
        marginTop: 100,
        marginBottom: 20,
        color: COLORS.WHITE,
    },
}))

const RootContentLayout = ({ title, children }) => {
    const classes = useStyles()

    return (
        <Container maxWidth="md" fixed className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography
                        className={classes.title}
                        variant="h4"
                        gutterBottom>
                        {title}
                    </Typography>
                </Grid>
                {children}
            </Grid>
        </Container>
    )
}

export default RootContentLayout
