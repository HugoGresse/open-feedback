import React, { Component } from 'react'
import OFButton from '../../admin/baseComponents/OFButton'
import Box from '@material-ui/core/Box'

class ErrorBoundaryWithGame extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error }
    }

    componentDidCatch(error, errorInfo) {
        // TODO : will be done later on
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box margin={4}>
                    <h3>
                        Something went wrong. It may be linked to an issue with
                        Open Feedback itself or your internet connection.{' '}
                    </h3>
                    <br />
                    <pre>{JSON.stringify(this.state.error)}</pre>
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

export default ErrorBoundaryWithGame
