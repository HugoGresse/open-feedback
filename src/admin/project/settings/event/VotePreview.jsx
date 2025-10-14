import React from 'react'
import { makeStyles } from '@mui/styles'
import { VoteButton } from '../../../../feedback/talk/components/VoteButton.jsx'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

const useStyles = makeStyles((theme) => ({
    previewContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    previewTitle: {
        marginBottom: theme.spacing(1),
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
    },
    voteButtonContainer: {
        width: '120px',
        height: '80px',
        display: 'inline-block',
    },
    voteTitle: {
        color: theme.palette.text.primary,
        fontSize: '14px',
        fontWeight: 500,
    },
}))

const VotePreview = ({ chipColors }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    // Don't render if no colors are available
    if (!chipColors || chipColors.length === 0) {
        return null
    }

    return (
        <div className={classes.previewContainer}>
            <Typography className={classes.previewTitle}>
                {t('settingsEvent.chipColorsPreview')}
            </Typography>
            <div className={classes.voteButtonContainer}>
                <VoteButton
                    isSelected={false}
                    chipColors={chipColors}
                    onClick={() => {}} // No-op for preview
                    count={5} // Sample vote count to show the background effect
                    displayChildren={true}
                >
                    <span className={classes.voteTitle}>
                        {t('settingsEvent.previewVoteTitle')}
                    </span>
                </VoteButton>
            </div>
        </div>
    )
}

export default VotePreview