import React, {useEffect} from 'react'
import RemoveButton from '@material-ui/icons/RemoveCircle'
import IconButton from '@material-ui/core/IconButton'
import Grid from "@material-ui/core/Grid"
import makeStyles from "@material-ui/core/styles/makeStyles"
import {useDispatch, useSelector} from 'react-redux'
import {getUserDetails, removeUserFromProject} from './usersActions'
import {getFilteredUsersSelector} from './usersSelectors'
import OFListItem from '../../../baseComponents/layouts/OFListItem'
import Avatar from '@material-ui/core/Avatar'
import {Box} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
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


const UserItem = ({userId, ownerId, currentUserId}) => {
    const classes = useStyles()
    const usersDetails = useSelector(getFilteredUsersSelector)
    const dispatch = useDispatch()

    const user = usersDetails[userId]

    useEffect(() => {
        dispatch(getUserDetails(userId))
    }, [dispatch])

    if (!user) {
        return ""
    }

    return <OFListItem>
        <Grid item xs={12} sm={6} className={classes.cell}>
            <Box display="flex">
                <Avatar alt={user.displayName} src={user.photoURL} style={{marginRight: 12, marginTop: 2}}/>
                <Box>
                    <Typography>{user.displayName}</Typography>
                    <Typography style={{color: "#999"}}>{user.email}</Typography>
                </Box>
            </Box>
        </Grid>
        <Grid item xs={12} sm={3} className={classes.cell}>
            {ownerId === userId ? "Owner" : "Member"}
        </Grid>
        <Grid item xs={12} sm={3} className={classes.buttonCell}>
            {!currentUserId && <IconButton aria-label="Remove the user from the event" onClick={() => dispatch(removeUserFromProject(userId))}>
                <RemoveButton/>
            </IconButton>}
        </Grid>
    </OFListItem>
}

export default UserItem
