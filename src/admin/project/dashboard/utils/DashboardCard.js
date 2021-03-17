import React from 'react'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { Box } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

const styles = (theme) => ({
    container: {
        marginBottom: 0,
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            minHeight: 400,
        },
    },
    content: {
        '&:last-child': {
            paddingBottom: 16,
        },
    },
    header: {
        marginBottom: 10,
    },
    icon: {
        position: 'relative',
        top: 5,
        right: 5,
        paddingLeft: 1,
    },
})

function DashboardCard({ title, titleIcon, rightChildren, children, classes }) {
    if (!children) {
        return <LoaderMatchParent />
    }

    return (
        <Card className={classes.container}>
            <CardContent className={classes.content}>
                <Grid
                    container
                    justify="space-between"
                    className={classes.header}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h3" gutterBottom>
                            <span className={classes.icon}>{titleIcon}</span>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} component={Box} textAlign="right">
                        {rightChildren && <div>{rightChildren}</div>}
                    </Grid>
                </Grid>
                {children}
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(DashboardCard)
