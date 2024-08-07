import React from 'react'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import { textEllipsis } from '../../../utils/stringUtils'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import BlockIcon from '@mui/icons-material/Block'
import Box from '@mui/material/Box'
import { VOTE_STATUS_HIDDEN } from '../../../core/contants'

const useStyles = makeStyles(() => ({
    date: {
        color: '#888',
    },
    content: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
}))

const TextVoteItem = ({ vote, onVoteExpandClick, onVoteHideClick }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const [text, isCutted] = textEllipsis(vote.text, 140)

    return (
        <div className={classes.content}>
            <Typography className={classes.date}>
                {DateTime.fromJSDate(vote.updatedAt.toDate()).toLocaleString({
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                })}
            </Typography>
            <Typography>
                {text}
                {isCutted && (
                    <OFButton
                        onClick={() => onVoteExpandClick(vote)}
                        style={{
                            design: 'text',
                            type: 'small',
                        }}>
                        Read more
                    </OFButton>
                )}
            </Typography>
            <Box textAlign="right" marginTop={1}>
                <OFButton
                    onClick={() => onVoteHideClick(vote)}
                    style={{
                        design: 'text',
                    }}>
                    <BlockIcon />
                    {vote.status === VOTE_STATUS_HIDDEN
                        ? t('moderation.unhideDialogConfirm')
                        : t('moderation.hide')}
                </OFButton>
            </Box>
        </div>
    )
}

export default TextVoteItem
