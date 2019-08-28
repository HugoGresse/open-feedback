import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import CardContent from '@material-ui/core/CardContent'
import VoteItemList from './VoteItemList'
import VotingFormOptions from './VotingFormOptions'
import Grid from '@material-ui/core/Grid'
import { getVoteItems } from './votingFormActions'
import OFPaper from '../../../baseComponents/OFPaper'
import OFCard from '../../../baseComponents/OFCard'

const VotingForm = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <OFCard>
                    <CardContent>
                        <VotingFormOptions />
                    </CardContent>
                </OFCard>
            </Grid>
            <Grid item xs={12}>
                <OFPaper>
                    <VoteItemList />
                </OFPaper>
            </Grid>
        </Grid>
    )
}

export default VotingForm
