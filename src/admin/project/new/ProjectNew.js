import React, { Component } from 'react'
import { connect } from 'react-redux'
import { newProject } from '../core/projectActions'
import { getUserSelector } from '../../auth/authSelectors'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import NewProjectTypeChooser from './NewProjectTypeChooser'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import styled from 'styled-components'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_MANUAL
} from '../core/projectTypes'
import ProjectAddEditInfos from '../ProjectAddEditInfos'

const Container = styled.div`
    min-height: 100vh
    display: flex
    flex-direction: column
`
const StepContentContainer = styled.div`
    height: 100%
    flex-grow: 1
`

class ProjectNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 0,
            newProjectLoading: false
        }
    }

    onValidateClick(data) {
        this.setState({
            newProjectLoading: true
        })
        this.props.newProject(data).then(newProjectId => {
            this.setState({
                newProjectLoading: false
            })
            if (newProjectId) {
                this.props.history.replace(`/admin/${newProjectId}`)
            }
        })
    }

    getSteps() {
        return ['Event setup', 'Event information', 'Fine tuning']
    }

    moveToStep(stepNumber, stepData) {
        console.log('Move to step ', stepNumber)
        this.setState({
            activeStep: stepNumber,
            [this.state.activeStep]: stepData
        })
    }

    getStepContent(activeStep) {
        switch (activeStep) {
            case 0:
                return (
                    <ProjectAddEditInfos
                        create={true}
                        onSubmitClicked={project => this.moveToStep(1, project)}
                        project={{
                            owner: this.props.currentUser.uid,
                            members: [this.props.currentUser.uid]
                        }}
                    />
                )
            case 1:
                return (
                    <NewProjectTypeChooser
                        onTypeSelected={data => this.moveToStep(2, data)}
                    />
                )
            case 2:
                switch (this.state[1]) {
                    case PROJECT_TYPE_HOVERBOARDV2:
                        return (
                            <ProjectAddEditInfos
                                create={true}
                                onSubmitClicked={project =>
                                    this.moveToStep(3, project)
                                }
                                project={{
                                    owner: this.props.currentUser.uid,
                                    members: [this.props.currentUser.uid]
                                }}
                            />
                        )
                    case PROJECT_TYPE_MANUAL:
                        return 'TODO'
                    default:
                        return 'Not managed'
                }
            default:
                return 'todo'
        }
    }

    render() {
        if (!this.props.currentUser) {
            return ''
        }

        if (this.state.newProjectLoading) {
            return <LoaderMatchParent />
        }

        const steps = this.getSteps()

        return (
            <Container>
                <Stepper activeStep={this.state.activeStep}>
                    {steps.map((label, index) => {
                        const props = {}
                        const labelProps = {}
                        props.completed = index < this.state.activeStep
                        return (
                            <Step key={label} {...props}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        )
                    })}
                </Stepper>
                <StepContentContainer>
                    {this.getStepContent(this.state.activeStep)}
                </StepContentContainer>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: getUserSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        newProject: newProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectNew)
