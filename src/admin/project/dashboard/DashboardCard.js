import React from 'react'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import COLORS from '../../../constants/colors'

const styles = theme => ({
    container: {
        marginBottom: theme.spacing(3)
    },
    content: {
        '&:last-child': {
            paddingBottom: 16
        }
    },
    title: {
        marginBottom: 24,
        color: COLORS.BLACK,
        position: 'relative',
        top: -8
    },
    icon: {
        position: 'relative',
        top: 5,
        right: 5,
        paddingLeft: 1
    }
})

function DashboardCard({ title, titleIcon, children, classes }) {
    if (!children) {
        return <LoaderMatchParent />
    }

    return (
        <Card className={classes.container}>
            <CardContent className={classes.content}>
                <Typography
                    component="h1"
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                >
                    <span className={classes.icon}>{titleIcon}</span>
                    {title}
                </Typography>

                {children}
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(DashboardCard)
