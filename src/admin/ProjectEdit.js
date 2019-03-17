import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedProjectSelector } from './projectCore/projectSelectors'
import { editProject } from './projectCore/projectActions'
import ProjectAddEditContent from './ProjectAddEditContent'

class ProjectEdit extends Component {
    constructor(props) {
        super(props)
    }

    onValidateClick(data) {
        this.props.editProject(data).then(id => {
            console.log('editedddd', id)
        })
    }

    render() {
        return (
            <ProjectAddEditContent
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
