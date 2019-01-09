import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import SpeakerItem from './SpeakerItem'

const styles = () => ({
    speakers: {
        display: 'flex',
        alignItems: 'center'
    }
})

class SpeakerList extends Component {
    render() {
        const { speakers, classes, size = 'medium' } = this.props

        return (
            <div className={classes.speakers}>
                {speakers.map((speaker, key) => (
                    <SpeakerItem key={key} {...speaker} size={size} />
                ))}
            </div>
        )
    }
}

export default withStyles(styles)(SpeakerList)
