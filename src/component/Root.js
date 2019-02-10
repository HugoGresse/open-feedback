import React, { Component } from 'react'
import { setFavicon } from './layout/utils'
import Header from './home/Header'
import Footer from './home/Footer'
import CallToAction from './home/CallToAction'
import HowItWorks from './home/HowItWorks'

class Root extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        return (
            <div>
                <Header />
                <HowItWorks />
                <CallToAction />
                <Footer />
            </div>
        )
    }
}

export default Root
