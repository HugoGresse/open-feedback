import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../baseComponents/design/Box'
import OFInput from '../baseComponents/design/OFInput'
import OFTextArea from '../baseComponents/design/OFTextArea'
import Button from '../baseComponents/design/Button'

const Wrapper = styled(Box)`
    padding: 15px;
    display: flex;
`

const defaultState = {
    name: '',
    websiteLink: '',
    scheduleLink: '',
    logoSmall: '',
    favicon: '',
    contact: '',
    owner: '',
    members: [],
    chipColors: ['999999'],
    firebaseConfig: {
        apiKey: 'AIzaSyB_n7dxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        databaseURL: 'https://xxxxx.firebaseio.com',
        projectId: 'some-project-id'
    },
    errors: []
}

class ProjectAddEditContent extends Component {
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
            name: project.name,
            websiteLink: project.websiteLink,
            scheduleLink: project.scheduleLink,
            logoSmall: project.logoSmall,
            favicon: project.favicon,
            contact: project.contact,
            owner: project.owner,
            members: JSON.stringify(project.members),
            chipColors: JSON.stringify(project.chipColors),
            firebaseConfig: JSON.stringify(project.firebaseConfig, undefined, 2)
        })
    }

    addErrorToState(errorMessage) {
        const error = this.state.errors
        error.push(errorMessage)
        this.setState({
            errors: error
        })
    }

    checkMissingData(field, errorMessage) {
        if (!field) {
            this.addErrorToState(errorMessage)
            return true
        }
        return false
    }

    onValidateClick(data) {
        const project = {
            name: data.name,
            websiteLink: data.websiteLink,
            scheduleLink: data.scheduleLink,
            logoSmall: data.logoSmall,
            favicon: data.favicon,
            contact: data.contact
        }

        this.setState({
            errors: []
        })
        this.checkMissingData(project.name, 'Missing project name')
        this.checkMissingData(project.websiteLink, 'Missing websiteLink')
        this.checkMissingData(project.scheduleLink, 'Missing scheduleLink')
        this.checkMissingData(project.logoSmall, 'Missing logoSmall')
        this.checkMissingData(project.favicon, 'Missing favicon')

        if (this.state.errors.length > 0) {
            return
        }

        try {
            project.chipColors = JSON.parse(data.chipColors)
        } catch (error) {
            this.addErrorToState('chipColors are not formatted correctly')
            return
        }
        try {
            project.firebaseConfig = JSON.parse(data.firebaseConfig)
        } catch (error) {
            this.addErrorToState('firebaseConfig is not formatted correctly')
            return
        }
        try {
            project.members = JSON.parse(data.members)
        } catch (error) {
            this.addErrorToState('Editors are not formatted correctly')
            return
        }

        this.setState({ errors: [] })

        this.props.onSubmitClicked(project)
    }

    render() {
        const { create } = this.props

        return (
            <>
                <Wrapper>
                    <Box>
                        <label>Event name</label>
                        <OFInput
                            value={this.state.name}
                            onChange={event =>
                                this.setState({
                                    name: event.target.value
                                })
                            }
                        />
                    </Box>
                </Wrapper>
                <Wrapper>
                    <Box>
                        <label>Event website</label>
                        <OFInput
                            value={this.state.websiteLink}
                            onChange={event =>
                                this.setState({
                                    websiteLink: event.target.value
                                })
                            }
                        />
                    </Box>
                    <Box>
                        <label>Event schedule</label>
                        <OFInput
                            value={this.state.scheduleLink}
                            onChange={event =>
                                this.setState({
                                    scheduleLink: event.target.value
                                })
                            }
                        />
                    </Box>
                </Wrapper>
                <Wrapper>
                    <Box>
                        <label>Logo url(png, small)</label>
                        <OFInput
                            value={this.state.logoSmall}
                            onChange={event =>
                                this.setState({
                                    logoSmall: event.target.value
                                })
                            }
                        />
                    </Box>
                    <Box>
                        <label>Favicon URL (png or ico)</label>
                        <OFInput
                            value={this.state.favicon}
                            onChange={event =>
                                this.setState({
                                    favicon: event.target.value
                                })
                            }
                        />
                    </Box>
                </Wrapper>
                <Wrapper>
                    <Box>
                        <label>
                            Contact email (in case of error or ?).
                            <br /> It will be somewhat public.
                        </label>
                        <OFInput
                            value={this.state.contact}
                            onChange={event =>
                                this.setState({
                                    contact: event.target.value
                                })
                            }
                        />
                    </Box>
                    <Box>
                        <label>Chip colors</label>
                        <OFInput
                            value={this.state.chipColors}
                            onChange={event =>
                                this.setState({
                                    chipColors: event.target.value
                                })
                            }
                        />
                    </Box>
                </Wrapper>
                <Wrapper>
                    <Box>
                        <label>Owner (read only)</label>
                        <OFInput value={this.state.owner} readOnly />
                    </Box>
                    <Box>
                        <label>Editors (read only)</label>
                        <OFInput value={this.state.members} readOnly />
                    </Box>
                </Wrapper>
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
                    <Button onClick={() => this.onValidateClick(this.state)}>
                        {create ? 'Create' : 'Save'}
                    </Button>
                </Wrapper>
            </>
        )
    }
}

export default ProjectAddEditContent
