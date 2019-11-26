import React from 'react'
import SpeakerListItem from './SpeakerListItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    getFilteredSpeakers,
    getSpeakersFilter,
} from '../../../core/speakers/speakerSelectors'
import { filterSpeakers } from '../../../core/speakers/speakerActions'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader'

const SpeakerList = () => {
    const dispatch = useDispatch()
    const speakers = useSelector(getFilteredSpeakers)
    const filter = useSelector(getSpeakersFilter)

    return (
        <Grid container>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(filterSpeakers(value))}
                buttonClick={() =>
                    alert(
                        'Speakers are read only here. You can probably update them through your Hoverboard Firestore or json url depending on your setup.'
                    )
                }
                buttonText="Save"
            />

            {speakers.map(speaker => (
                <SpeakerListItem speaker={speaker} key={speaker.id} />
            ))}
        </Grid>
    )
}

export default SpeakerList
