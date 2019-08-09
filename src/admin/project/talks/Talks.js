import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Card from '@material-ui/core/Card'

class Talks extends Component {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography>
                        You cannot edit talks for the moment. The feature is
                        planned, check this{' '}
                        <Link href="https://github.com/HugoGresse/open-feedback/issues/78">
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
)(Talks)
