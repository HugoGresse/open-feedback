import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { Avatar } from '@material-ui/core'

const styles = () => ({
    speaker: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '18px'
    },
    avatar: {
        marginRight: '13px'
    }
})

class SpeakerItem extends Component {
    render() {
        const { name, photoUrl, classes } = this.props

        return (
            <div className={classes.speaker}>
                <Avatar src={photoUrl} alt={name} className={classes.avatar} />
                {name}
            </div>
        )
    }
}

export default withStyles(styles)(SpeakerItem)
