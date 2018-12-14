import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFilteredSessions, sessionActions } from "./core"
import { createSelector } from "reselect"

class SessionList extends Component {

    componentDidMount() {
        this.props.getSessions()
    }

    render() {
        const {sessions} = this.props;

        console.log( sessions)

        return (
            <div className="dashboard container">
                <div className="row">
                </div>
            </div>
        )
    }


}


const mapStateToProps = createSelector(
    getFilteredSessions,
    (sessions) => ({
        sessions
    })
)

const mapDispatchToProps = Object.assign({}, sessionActions)

export default connect(mapStateToProps, mapDispatchToProps)(SessionList)