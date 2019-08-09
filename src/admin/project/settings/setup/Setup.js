import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Card from '@material-ui/core/Card'

class Setup extends Component {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography>
                        You cannot edit the setup of the project, only
                        Hoverboardv2 is supported yet. The feature is planned,
                        check this{' '}
                        <Link href="https://github.com/HugoGresse/open-feedback/issues/80">
                            issue
                        </Link>{' '}
                        and this{' '}
                        <Link href="https://github.com/HugoGresse/open-feedback/issues/79">
                            one
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
)(Setup)
