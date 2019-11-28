import React, { useState } from 'react'
import SpeakerListItem from './SpeakerListItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    getFilteredSpeakers,
    getSpeakersFilter,
} from '../../../core/speakers/speakerSelectors'
import { filterSpeakers } from '../../../core/speakers/speakerActions'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader'
import SpeakerAddEditPanel from './SpeakerAddEditPanel'

const SpeakerList = () => {
    const dispatch = useDispatch()
    const speakers = useSelector(getFilteredSpeakers)
    const filter = useSelector(getSpeakersFilter)
    const [sidePanelOpen, setSidePanelOpen] = useState(true)

    return (
        <Grid container>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(filterSpeakers(value))}
                buttonClick={() => setSidePanelOpen(true)}
                buttonText="Add speaker"
            />

            <SpeakerAddEditPanel
                isOpen={sidePanelOpen}
                onClose={() => setSidePanelOpen(false)}
                onSubmit={data => console.log(data)}
            />

            {speakers.map(speaker => (
                <SpeakerListItem speaker={speaker} key={speaker.id} />
            ))}
        </Grid>
    )
}

export default SpeakerList
