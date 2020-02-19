import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import { textEllipsis } from '../../../utils/stringUtils'
import OFButton from '../../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import BlockIcon from '@material-ui/icons/Block'
import Box from '@material-ui/core/Box'

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
                    {t('moderation.hide')}
                </OFButton>
            </Box>
        </div>
    )
}

export default TextVoteItem
