import React, { Component } from 'react'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

class Users extends Component {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography>
                        You cannot add/edit Users for the moment, but you can
                        ask {process.env.REACT_APP_ADMIN_EMAIL}. The feature is
                        planned, check this{' '}
                        <Link href="https://github.com/HugoGresse/open-feedback/issues/55">
                            issue
                        </Link>{' '}
                        for more info.
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = Object.assign({}, {})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users)
