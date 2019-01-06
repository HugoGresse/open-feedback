import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import SessionList from './component/session/SessionList'
import Header from './component/layout/Header'
import SessionVote from './component/session/SessionVote'
import { withStyles } from '@material-ui/core'
import './App.css'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { setFavicon } from './component/layout/utils'
import { authActions } from './component/auth'
import { getProjectSelector } from './component/project/projectSelectors'
import * as projectActions from './component/project/projectActions'

const styles = theme => ({
    loading: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center'
    },
    layout: {
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2
        }
    }
})

class App extends Component {
    componentWillMount() {
        const id = this.props.match.params.projectId
        this.props.getProject(id)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.project) {
            const project = nextProps.project
            document.title = project.name + ' - Feedback'
            setFavicon(project.favicon)
            this.props.signIn()
        }
    }

    render() {
        const { classes, match, project } = this.props

        if (project) {
            return (
                <div>
                    <Header logo={project.logoSmall} />

                    <div className={classes.layout}>
                        <br />

                        <Switch>
                            <Route
                                exact
                                path={`${match.path}`}
                                component={SessionList}
                            />
                            <Route
                                path={`${match.path}/:sessionId`}
                                component={SessionVote}
                            />
                        </Switch>

                        <br />
                    </div>
                </div>
            )
        }

        return (
            <div className={classes.loading}>
                <CircularProgress />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    project: getProjectSelector(state)
})

const mapDispatchToProps = Object.assign({}, projectActions, authActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(App))
