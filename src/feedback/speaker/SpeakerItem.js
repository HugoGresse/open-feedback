import React, { Component } from 'react'
import { Avatar, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const styles = () => ({
    speaker: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '18px',
    },
    avatar: {
        marginRight: '13px',
    },
    smallAvatar: {
        height: '20px',
        width: '20px',
    },
    mediumAvatar: {
        height: '40px',
        width: '40px',
    },
    smallText: {
        fontSize: '11px',
        opacity: 0.7,
    },
    mediumText: {
        fontSize: '15px',
        opacity: 0.7,
    },
})

class SpeakerItem extends Component {
    render() {
        const { name, photoUrl, classes, size } = this.props

        return (
            <div className={classes.speaker}>
                <Avatar
                    src={photoUrl}
                    alt={name}
                    className={classes.avatar + ' ' + classes[size + 'Avatar']}
                />
                <Typography
                    color="textPrimary"
                    className={classes[size + 'Text']}>
                    {name}
                </Typography>
            </div>
        )
    }
}

export default withStyles(styles)(SpeakerItem)
