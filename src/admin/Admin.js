import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Login from './auth/Login'

class Admin extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        return <Login />
    }
}

export default Admin
