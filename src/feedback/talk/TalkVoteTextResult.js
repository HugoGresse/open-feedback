import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import moment from 'moment'

const styles = theme => ({
    date: {
        color: '#888',
        fontSize: 14,
        marginBottom: 0,
    },
    comment: {
        borderBottom: '1px solid #e8e8e8',
        paddingBottom: 15,
        marginTop: 10,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
})

class TalkVoteTextResult extends Component {
    render() {
        const { result, classes } = this.props

        return (
            <div className="comments">
                {result.map((item, key) => (
                    <div key={key}>
                        <p className={classes.date}>
                            {moment(item.updatedAt).fromNow()}
                        </p>
                        <p className={classes.comment}>{item.text}</p>
                    </div>
                ))}
            </div>
        )
    }
}

TalkVoteTextResult.propTypes = {
    classes: PropTypes.object.isRequired,
    result: PropTypes.array.isRequired,
}

export default withStyles(styles)(TalkVoteTextResult)
