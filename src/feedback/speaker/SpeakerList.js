import React from 'react'
import SpeakerItem from './SpeakerItem'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
    speakers: {
        display: 'flex',
        alignItems: 'center',
    },
}))

const SpeakerList = ({ speakers, size = 'medium' }) => {
    const classes = useStyles()
    return (
        <div className={classes.speakers}>
            {speakers.map((speaker, key) => (
                <SpeakerItem key={key} {...speaker} size={size} />
            ))}
        </div>
    )
}

export default SpeakerList
