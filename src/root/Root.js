import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Header from './Header'
import Footer from './Footer'
import HowItWorks from './HowItWorks'

class Root extends Component {
    componentDidMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        return (
            <div>
                <Header />
                <HowItWorks />
                {/*<CallToAction />*/}
                <Footer />
            </div>
        )
    }
}

export default Root
