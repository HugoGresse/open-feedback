import React, { Component } from 'react'
import OFButton from '../../admin/baseComponents/button/OFButton'
import Box from '@material-ui/core/Box'
import createAlert from '../../utils/alerting/createAlert'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error }
    }

    componentDidCatch(error, errorInfo) {
        if (process.env.NODE_ENV === 'production') {
            createAlert(
                this.props.errorToReport(error, errorInfo.componentStack)
            )
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box margin={4}>
                    <h3>
                        Something went wrong. It may be linked to an issue with
                        Open Feedback itself or your internet connection.{' '}
                    </h3>
                    <p>
                        An alert has been triggered and someone will hopefully
                        fix this soon (I think it is me)
                    </p>
                    <br />
                    <pre>{String(this.state.error)}</pre>
                    <br />
                    <OFButton href={window.location.href}>
                        Reload the page
                    </OFButton>
                    <br />
                    <br />
                    <OFButton
                        style={{ design: 'text' }}
                        variant="outlined"
                        href="https://github.com/HugoGresse/open-feedback/issues">
                        Report the issue
                    </OFButton>
                </Box>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
