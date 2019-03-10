import React, { Component } from 'react'
import styled from 'styled-components'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getSelectedProjectSelector } from './project/projectSelectors'
import { editProject, selectProject } from './project/projectActions'
import OFInput from '../baseComponents/design/OFInput'
import OFTextArea from '../baseComponents/design/OFTextArea'
import Button from '../baseComponents/design/Button'

const Wrapper = styled(Box)`
    padding: 15px;
    display: flex;
`

class Project extends Component {
    componentWillMount() {
        this.props.selectProject(this.props.match.params.projectId)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!this.props.project && nextProps.project) {
            const project = nextProps.project
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
                firebaseConfig: JSON.stringify(
                    project.firebaseConfig,
                    undefined,
                    2
                )
            })
        }
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
        try {
            project.chipColors = JSON.parse(data.chipColors)
        } catch (error) {
            this.setState({ error: 'chipColors are not formatted correctly' })
            return
        }
        try {
            project.firebaseConfig = JSON.parse(data.firebaseConfig)
        } catch (error) {
            this.setState({
                error: 'firebaseConfig is not formatted correctly'
            })
            return
        }
        try {
            project.members = JSON.parse(data.members)
        } catch (error) {
            this.setState({ error: 'Editors are not formatted correctly' })
            return
        }

        this.setState({ error: null })

        this.props.editProject(project)
    }

    render() {
        const { project } = this.props

        if (!project) {
            return ''
        }

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

                <Wrapper>
                    {this.state.error && `Error: ${this.state.error}`}
                </Wrapper>

                <Wrapper>
                    <Button onClick={() => this.onValidateClick(this.state)}>
                        Save
                    </Button>
                </Wrapper>
            </>
        )
    }
}

const mapStateToProps = state => ({
    project: getSelectedProjectSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        selectProject: selectProject,
        editProject: editProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project)
