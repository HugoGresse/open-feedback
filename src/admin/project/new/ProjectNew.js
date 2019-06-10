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
import Hoverboardv2Config from '../types/Hoverboardv2Config'
import ManualConfig from '../types/ManualConfig'

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
            newProjectLoading: false,
            stepData: {
                0: {},
                1: {},
                2: {}
            }
        }
    }

    onValidateClick() {
        this.setState({
            newProjectLoading: true
        })

        const projectData = {
            ...this.state.stepData[0],
            setupType: this.state.stepData[1],
            ...this.state.stepData[2]
        }

        this.props.newProject(projectData).then(newProjectId => {
            this.setState({
                newProjectLoading: false
            })
            this.props.history.replace(`/admin/${newProjectId}`)
        })
    }

    getSteps() {
        return ['Information', 'Setup', 'Configuration']
    }

    moveToStep(stepNumber, stepData) {
        const state = {
            ...this.state,
            activeStep: stepNumber
        }
        if (stepData) {
            state.stepData[this.state.activeStep] = stepData
        }

        this.setState(state)

        if (stepNumber >= this.getSteps().length) {
            this.onValidateClick()
        }
    }

    getStepContent(activeStep) {
        switch (activeStep) {
            case 0:
                return (
                    <ManualConfig
                        onCancelClicked={() => this.moveToStep(1)}
                        onSubmitClicked={config => this.moveToStep(3, config)}
                    />
                )
            case 1:
                return (
                    <NewProjectTypeChooser
                        cancelText="Back"
                        submitText="Next"
                        selectedSetup={this.state.stepData[1]}
                        onCancel={() => this.moveToStep(0)}
                        onSubmit={data => this.moveToStep(2, data)}
                    />
                )
            case 2:
                switch (this.state.stepData[1]) {
                    case PROJECT_TYPE_HOVERBOARDV2:
                        return (
                            <Hoverboardv2Config
                                create={true}
                                onCancelClicked={() => this.moveToStep(1)}
                                onSubmitClicked={config =>
                                    this.moveToStep(3, config)
                                }
                            />
                        )
                    case PROJECT_TYPE_MANUAL:
                        return (
                            <ManualConfig
                                onCancelClicked={() => this.moveToStep(1)}
                                onSubmitClicked={config =>
                                    this.moveToStep(3, config)
                                }
                            />
                        )
                    default:
                        return 'Not managed'
                }
            case 3:
                return ''
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
