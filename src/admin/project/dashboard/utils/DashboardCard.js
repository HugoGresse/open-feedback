import React from 'react'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { Box } from '@material-ui/core'

const styles = theme => ({
    container: {
        marginBottom: theme.spacing(3),
        position: 'relative',
    },
    content: {
        '&:last-child': {
            paddingBottom: 16,
        },
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
                <Box
                    display="flex"
                    justifyContent="space-between"
                    top={-8}
                    marginBottom={2}>
                    <Typography component="h1" gutterBottom>
                        <span className={classes.icon}>{titleIcon}</span>
                        {title}
                    </Typography>
                    {rightChildren && <div>{rightChildren}</div>}
                </Box>

                {children}
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(DashboardCard)
