import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import TalkListItem from "./TalkListItem"
import { getFilteredSessionsSelector, getSessionsFilterSelector } from "../../../core/sessions/sessionsSelectors"
import { setSessionsFilter } from "../../../core/sessions/sessionsActions"
import { getSpeakersListSelector } from "../../../core/speakers/speakerSelectors"
import Grid from "@material-ui/core/Grid"
import OFListHeader from '../../baseComponents/layouts/OFListHeader'

const TalkList = () => {
    const dispatch = useDispatch()
    const talks = useSelector(getFilteredSessionsSelector)
    const speakers = useSelector(getSpeakersListSelector)
    const filter = useSelector(getSessionsFilterSelector)

    return (
        <Grid container>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(setSessionsFilter(value))}
                buttonProcessing={false}
                buttonClick={() => alert('Talks are read only here. You can probably update them through your Hoverboard Firestore or json url depending on your setup.')}
                buttonText="Save"
            />
            {talks.map(talk => <TalkListItem item={talk} key={talk.id}
                                             speakers={talk.speakers.map(id => speakers[id])}/>)}
        </Grid>
    )
}

export default TalkList
