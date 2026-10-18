import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import WarningIcon from '@mui/icons-material/Warning'
import { useTranslation } from 'react-i18next'
import type { SpeakersMap } from '../../../core/models'

const useStyles = makeStyles(() => ({
    chip: {
        marginBottom: 4,
        maxWidth: '100%',
    },
}))

export interface TalkListItemSpeakerListProps {
    speakers: SpeakersMap
    speakersIds?: string[]
    onSpeakerClicked: (speakerName: string) => void
}

export const TalkListItemSpeakerList = ({
    speakers,
    speakersIds,
    onSpeakerClicked,
}: TalkListItemSpeakerListProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    if (!speakersIds) {
        return ''
    }

    return (
        <ul>
            {speakersIds.map((speakerId) => {
                if (speakers[speakerId]) {
                    return (
                        <Chip
                            classes={{
                                root: classes.chip,
                            }}
                            key={speakerId}
                            label={speakers[speakerId].name}
                            variant="outlined"
                            onClick={() =>
                                onSpeakerClicked(speakers[speakerId].name)
                            }
                            component="li"
                            avatar={
                                <Avatar
                                    alt={speakers[speakerId].name}
                                    src={speakers[speakerId].photoUrl}
                                />
                            }
                        />
                    )
                } else {
                    return (
                        <Tooltip
                            title={t('talks.speakerMissing')}
                            key={speakerId}
                        >
                            <Chip
                                label={speakerId}
                                className={classes.chip}
                                variant="outlined"
                                icon={<WarningIcon style={{ width: 20 }} />}
                                classes={{
                                    root: classes.chip,
                                }}
                            />
                        </Tooltip>
                    )
                }
            })}{' '}
        </ul>
    )
}
