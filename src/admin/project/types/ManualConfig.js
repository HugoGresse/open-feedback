import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../../../baseComponents/design/Box'
import Button from '../../../baseComponents/design/Button'

const Wrapper = styled(Box)`
    padding: 15px;
    display: flex;
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
    ]
}

class ManualConfig extends Component {
    constructor(props) {
        super(props)
        this.state = defaultState
    }

    render() {
        return (
            <>
                Still WIP. Go back later on to create your event feedback
                website here or use Hoverboard setup.
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
