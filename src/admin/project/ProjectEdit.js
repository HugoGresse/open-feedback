import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedProjectSelector } from './core/projectSelectors'
import { editProject } from './core/projectActions'
import ProjectAddEditInfos from './ProjectAddEditInfos'

class ProjectEdit extends Component {
    onValidateClick(data) {
        this.props.editProject(data)
    }

    render() {
        return (
            <ProjectAddEditInfos
                onSubmitClicked={project => this.onValidateClick(project)}
                project={this.props.project}
            />
        )
    }
}

const mapStateToProps = state => ({
    project: getSelectedProjectSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        editProject: editProject
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectEdit)
