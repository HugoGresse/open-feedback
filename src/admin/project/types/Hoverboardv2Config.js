import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../../../baseComponents/design/Box'
import OFTextArea from '../../baseComponents/OFTextArea'
import Button from '../../../baseComponents/design/Button'

const Wrapper = styled(Box)`
    padding: 15px;
    display: flex;
`

const defaultState = {
    firebaseConfig: {
        apiKey: 'AIzaSyB_n7dxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        databaseURL: 'https://xxxxx.firebaseio.com',
        projectId: 'some-project-id'
    },
    errors: []
}

class Hoverboardv2Config extends Component {
    constructor(props) {
        super(props)
        this.state = defaultState
    }

    componentDidMount() {
        if (this.props && this.props.project) {
            this.updateLocalStateFromProps(
                Object.assign({}, defaultState, this.props.project)
            )
        } else {
            this.updateLocalStateFromProps(null)
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.updateLocalStateFromProps(nextProps.project)
    }

    updateLocalStateFromProps(project) {
        if (!project) {
            project = defaultState
        }
        this.setState({
            firebaseConfig: JSON.stringify(project.firebaseConfig, undefined, 2)
        })
    }

    onValidateClick(data) {
        const config = {}
        const errors = []

        try {
            config.firebaseConfig = JSON.parse(data.firebaseConfig)
        } catch (error) {
            errors.push('firebaseConfig is not formatted correctly')
        }

        this.setState({ errors: errors })

        if (errors.length === 0) {
            this.props.onSubmitClicked(config)
        }
    }

    render() {
        const { create } = this.props

        return (
            <>
                <Wrapper>
                    <Box width="100%">
                        <label>Hoverboard v2 config</label>
                        <OFTextArea
                            width="100%"
                            height="100px"
                            value={this.state.firebaseConfig}
                            onChange={event =>
                                this.setState({
                                    firebaseConfig: event.target.value
                                })
                            }
                        />
                    </Box>
                </Wrapper>

                {this.state.errors.map((error, index) => {
                    return <Wrapper key={index}>{error}</Wrapper>
                })}

                <Wrapper>
                    {create && (
                        <Button
                            onClick={() =>
                                this.props.onCancelClicked(this.state)
                            }
                        >
                            Back
                        </Button>
                    )}
                    <Button onClick={() => this.onValidateClick(this.state)}>
                        {create ? 'Create' : 'Save'}
                    </Button>
                </Wrapper>
            </>
        )
    }
}

export default Hoverboardv2Config
