import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import withStyles from '@material-ui/core/styles/withStyles'
import { Typography } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import { useDispatch, useSelector } from 'react-redux'
import { isCommentEnableSelector } from './votingFormSelectors'
import { toggleVoteComment } from './votingFormActions'

const styles = () => ({
    label: {
        fontSize: '0.9rem'
    }
})

function VotingFormOptions({ classes }) {
    const dispatch = useDispatch()
    const isCommentEnable = useSelector(isCommentEnableSelector)

    return (
        <>
            <Typography variant="subtitle2" gutterBottom>
                Options
            </Typography>

            <Divider />

            <FormControlLabel
                control={
                    <Switch
                        checked={isCommentEnable}
                        value="toto"
                        color="primary"
                        onChange={event =>
                            dispatch(toggleVoteComment(event.target.checked))
                        }
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                }
                classes={{
                    label: classes.label
                }}
                label="Enable comment"
            />
        </>
    )
}

export default withStyles(styles)(VotingFormOptions)
