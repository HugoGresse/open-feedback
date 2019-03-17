import React, { Component } from 'react'
import { connect } from 'react-redux'
import { newProject } from './projectCore/projectActions'
import ProjectAddEditContent from './ProjectAddEditContent'
import { getUserSelector } from './auth/authSelectors'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent'

class ProjectAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
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

    render() {
        if (!this.props.currentUser) {
            return ''
        }

        if (this.state.newProjectLoading) {
            return <LoaderMatchParent />
        }

        return (
            <ProjectAddEditContent
                addingMode={true}
                onSubmitClicked={project => this.onValidateClick(project)}
                project={{
                    owner: this.props.currentUser.uid,
                    members: [this.props.currentUser.uid]
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    currentUser: getUserSelector(state)
})

// TODO : getLastNotifications

const mapDispatchToProps = Object.assign(
    {},
    {
        newProject: newProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectAdd)
