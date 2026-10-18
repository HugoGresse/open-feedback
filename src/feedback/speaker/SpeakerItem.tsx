import { Avatar } from '@mui/material'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import type { Theme } from '@mui/material/styles'
import { SIZE_SMALL, type SpeakerSize } from './SpeakerList.tsx'

interface SpeakerItemStyleProps {
    isLinkable: boolean
    isSmall: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    speaker: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '18px',
        paddingRight: 12,
        transition: 'all 200ms',
        marginTop: (props: SpeakerItemStyleProps) => (props.isSmall ? -4 : 1),
        '&:hover': {
            textDecoration: 'none',
            boxShadow: (props: SpeakerItemStyleProps) =>
                props.isLinkable
                    ? `0 0 3px ${theme.palette.headerShadow}`
                    : 'none',
            borderRadius: '20px 4px 4px 20px',
        },
    },
    avatar: {
        marginRight: '13px',
    },
    smallAvatar: {
        height: '20px',
        width: '20px',
    },
    mediumAvatar: {
        height: '40px',
        width: '40px',
    },
    smallText: {
        fontSize: '12px',
        opacity: 0.7,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
    },
    mediumText: {
        fontSize: '15px',
        opacity: 0.7,
    },
}))

interface SpeakerItemProps {
    name: string
    photoUrl?: string
    socialProfil?: string
    size: SpeakerSize
}

export const SpeakerItem = ({
    name,
    photoUrl,
    socialProfil,
    size,
}: SpeakerItemProps) => {
    const { t } = useTranslation()
    const isSmall = size === SIZE_SMALL
    const isLinkable = !isSmall && socialProfil

    const classes = useStyles({
        isLinkable: !!isLinkable,
        isSmall,
    })

    const content = (
        <>
            <Avatar
                src={photoUrl}
                alt={`${t('speakerAvatar')} ${name}`}
                className={classes.avatar + ' ' + classes[`${size}Avatar`]}
            />
            <Typography color="textPrimary" className={classes[`${size}Text`]}>
                {name}
            </Typography>
        </>
    )

    return isLinkable ? (
        <Box
            className={classes.speaker}
            component={Link}
            href={isLinkable}
            target="_blank"
            title={isLinkable}
        >
            {content}
        </Box>
    ) : (
        <Box className={classes.speaker} component="div">
            {content}
        </Box>
    )
}
