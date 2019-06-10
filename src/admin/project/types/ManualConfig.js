import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../../../baseComponents/design/Box'
import Button from '../../../baseComponents/design/Button'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Grid from '@material-ui/core/Grid'
import { SPACING } from '../../../constants/constants'
import SessionVote from '../../../feedback/session/SessionVote'
import TextField from '@material-ui/core/TextField'
import { HEX_COLORS } from '../../../constants/colors'
import LiveTalksCreationForm from './manual/LiveTalksCreationForm'

const Wrapper = styled(Box)`
    padding: 15px;
    display: flex;
`

const FormGrid = styled(Grid)`
    padding: 15px;
    background: #eee;
    border-radius: 5px;
    border: 1px solid ${HEX_COLORS.RED_ORANGE};
`
const FormField = styled(Field)`
    width; 100%;
`
const FormErrorMessage = styled(ErrorMessage)`
    width; 100%;
`

const defaultState = {
    talks: [
        {
            name: 'Learn React in 30min',
            trackTitle: 'Room 1',
            startTime: '',
            endTime: '',
            tag: ['Cloud'],
            speakers: [
                {
                    name: 'Turpli Houlou',
                    photoUrl: 'https://example.com/photo.img',
                    title: 'Software engineer'
                }
            ]
        }
    ],
    tracks: []
}

class ManualConfig extends Component {
    constructor(props) {
        super(props)
        this.state = defaultState
    }

    addTalk(talk) {
        const talks = this.state.talks
        const trakcs = this.state.trakcs
        talks.push(talk)

        this.setState({})
    }

    render() {
        return (
            <>
                <Grid container>
                    <FormGrid item xs={12} sm={4} md={4}>
                        <LiveTalksCreationForm
                            onSubmit={talk => {
                                console.log('New talk submitted', talk)
                            }}
                        />
                    </FormGrid>
                    <Grid item xs={12} sm={8} md={8}>
                        Talks will be displayed here
                    </Grid>
                </Grid>

                <Wrapper>
                    <Button onClick={() => this.props.onCancelClicked()}>
                        Back
                    </Button>
                    <Button onClick={() => this.props.onSubmitClicked()}>
                        Create
                    </Button>
                </Wrapper>
            </>
        )
    }
}

export default ManualConfig
