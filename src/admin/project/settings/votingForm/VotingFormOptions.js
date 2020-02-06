import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import withStyles from '@material-ui/core/styles/withStyles'
import Divider from '@material-ui/core/Divider'
import { useDispatch, useSelector } from 'react-redux'
import { isCommentEnableSelector } from './votingFormSelectors'
import { toggleVoteComment } from './votingFormActions'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import { useTranslation } from 'react-i18next'

const styles = () => ({
    label: {
        fontSize: '0.9rem',
    },
})

function VotingFormOptions({ classes }) {
    const dispatch = useDispatch()
    const isCommentEnable = useSelector(isCommentEnableSelector)
    const { t } = useTranslation()

    return (
        <>
            <TranslatedTypography
                variant="subtitle2"
                gutterBottom
                i18nKey="settingsVotingForm.options">
                Options
            </TranslatedTypography>

            <Divider />

            <br />

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
                    label: classes.label,
                }}
                label={t('settingsVotingForm.enableComment')}
            />
        </>
    )
}

export default withStyles(styles)(VotingFormOptions)
