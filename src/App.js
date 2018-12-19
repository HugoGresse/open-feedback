import React, {Component} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import './App.css'
import SessionList from "./component/session/SessionList"
import Header from "./component/layout/Header"

class App extends Component {
    render() {
        return (

            <BrowserRouter>
                <div className="App">

                    <Header/>

                    <Route exact path='/' component={SessionList}/>

                </div>
            </BrowserRouter>
        )
    }
}

export default App
