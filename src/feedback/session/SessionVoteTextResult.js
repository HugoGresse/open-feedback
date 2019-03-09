import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import moment from 'moment'

const styles = theme => ({})

class SessionVoteTextResult extends Component {
    render() {
        const { result } = this.props

        return (
            <div>
                {result.map((item, key) => (
                    <p key={key}>
                        <span>{moment(item.updatedAt).fromNow()} - </span>

                        {item.text}
                    </p>
                ))}
            </div>
        )
    }
}

SessionVoteTextResult.propTypes = {
    classes: PropTypes.object.isRequired,
    result: PropTypes.array.isRequired
}

export default withStyles(styles)(SessionVoteTextResult)
