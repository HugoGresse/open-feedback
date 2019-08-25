import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import VoteItemList from './VoteItemList'
import Paper from '@material-ui/core/Paper'
import VotingFormOptions from './VotingFormOptions'
import Grid from '@material-ui/core/Grid'
import { getVoteItems } from './votingFormActions'

const VotingForm = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <VotingFormOptions />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <VoteItemList />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default VotingForm
