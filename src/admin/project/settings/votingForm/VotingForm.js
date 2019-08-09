import React, { Component } from 'react'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Config from '../../../../config'

class VotingForm extends Component {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography>
                        You cannot add/edit Voting Form for the moment, but you
                        can ask {Config.adminAddress}. The feature is planned,
                        check this{' '}
                        <Link href="https://github.com/HugoGresse/open-feedback/issues/58">
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
)(VotingForm)
