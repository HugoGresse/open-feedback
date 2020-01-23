import React, { Component } from 'react'
import { setFavicon } from '../feedback/layout/utils'
import Header from './Header'
import Footer from './Footer'
import HowItWorks from './HowItWorks'
import FAQ from './FAQ'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'

class Root extends Component {
    componentDidMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Header />
                <HowItWorks />
                <FAQ />
                <Footer />
            </I18nextProvider>
        )
    }
}

export default Root
