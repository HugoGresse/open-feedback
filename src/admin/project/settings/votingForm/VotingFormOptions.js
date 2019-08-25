import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import withStyles from '@material-ui/core/styles/withStyles'
import { Typography } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

const styles = () => ({
    label: {
        fontSize: '0.9rem'
    }
})

function VotingFormOptions({ classes }) {
    return (
        <>
            <Typography variant="subtitle2" gutterBottom>
                Options
            </Typography>

            <Divider />

            <FormControlLabel
                control={
                    <Switch
                        checked={true}
                        value="checkedB"
                        color="primary"
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
