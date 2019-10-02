import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { getDateFromStartTime } from "../../../core/sessions/sessionsUtils"
import Grid from "@material-ui/core/Grid"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { darken, fade, lighten } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    container: {
        padding: '12px 30px',
        borderBottom: `1px solid ${
            theme.palette.type === 'light'
                ? lighten(fade(theme.palette.divider, 1), 0.88)
                : darken(fade(theme.palette.divider, 1), 0.68)
        }`,
        alignItems: 'center'
    },
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right'
    }
}))


const TalkListItem = ({item, speakers}) => {
    const classes = useStyles()

    const onButtonClick = () => {
        alert('Talks are read only here. You can probably update them through your Hoverboard Firestore or json url ' +
            'depending on your setup.')
    }
    return (
        <Grid item xs={12}>
            <Grid container className={classes.container}>
                <Grid item xs={12} sm={4} lg={6} className={classes.cell}>
                    <b>{item.title}</b>
                </Grid>
                <Grid item xs={12} sm={3} lg={2} className={classes.cell}>
                    {speakers.map(speaker => speaker && speaker.name + ' \n')}
                </Grid>
                <Grid item xs={12} sm={3} lg={2} className={classes.cell}>
                    {item.trackTitle}
                    <br/>
                    {getDateFromStartTime(item.startTime)}
                </Grid>
                <Grid item xs={12} sm={2} lg={2} className={classes.buttonCell}>
                    <IconButton aria-label="edit" onClick={() => onButtonClick()}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton aria-label="delete" onClick={() => onButtonClick()}>
                        <DeleteIcon/>
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default TalkListItem
