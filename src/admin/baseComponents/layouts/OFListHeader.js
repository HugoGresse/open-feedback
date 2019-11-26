import Grid from '@material-ui/core/Grid'
import OFInput from '../OFInput'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import OFButton from '../OFButton'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    progress: {
        width: 30,
        height: 30,
        marginRight: 10,
        position: 'relative',
        verticalAlign: 'middle',
    },
    header: {
        padding: 20,
    },
    headerRight: {
        textAlign: 'right',
        [theme.breakpoints.down('sm')]: {
            marginTop: 12,
        },
    },
}))

const OFListHeader = ({
    filterValue,
    filterChange,
    buttonProcessing,
    buttonClick,
    buttonText,
}) => {
    const classes = useStyles()

    return (
        <Grid container className={classes.header}>
            <Grid item xs={12} sm={6}>
                <OFInput
                    placeholder="Search"
                    value={filterValue}
                    onChange={event => filterChange(event.target.value)}
                />
            </Grid>

            <Grid item xs={12} sm={6} className={classes.headerRight}>
                <Fade in={buttonProcessing}>
                    <CircularProgress size={30} className={classes.progress} />
                </Fade>

                <OFButton onClick={() => buttonClick()}>{buttonText}</OFButton>
            </Grid>
        </Grid>
    )
}
export default OFListHeader
