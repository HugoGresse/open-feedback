import React from 'react'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent.jsx'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import withStyles from '@mui/styles/withStyles';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'

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
                    justifyContent="space-between"
                    className={classes.header}
                >
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
