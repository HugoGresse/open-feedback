import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import SessionList from "./component/session/SessionList"
import Header from "./component/layout/Header"
import SessionVote from "./component/session/SessionVote"
import { withStyles } from "@material-ui/core"
import './App.css'


const styles = theme => ({
    layout: {
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: "auto",
            marginRight: "auto"
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2
        }
    }
})

class App extends Component {
    render() {
        const {classes} = this.props
        return (

            <BrowserRouter>
                <div>
                    <Header/>

                    <div className={classes.layout}>
                        <br/>

                        <Route exact path='/' component={SessionList}/>
                        <Route path='/:sessionId' component={SessionVote}/>

                        <br/>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default withStyles(styles)(App)
