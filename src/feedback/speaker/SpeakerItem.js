import React from 'react'
import { Avatar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Box from '@material-ui/core/Box'
import { useTranslation } from 'react-i18next'
import { SIZE_SMALL } from './SpeakerList'

const useStyles = makeStyles((theme) => ({
    speaker: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '18px',
        paddingRight: 12,
        transition: 'all 200ms',
        marginTop: (props) => (props.isSmall ? -4 : 1),
        '&:hover': {
            textDecoration: 'none',
            boxShadow: (props) =>
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

const SpeakerItem = ({ name, photoUrl, socialProfil, size }) => {
    const { t } = useTranslation()
    const isSmall = size === SIZE_SMALL
    const isLinkable = !isSmall && socialProfil

    const classes = useStyles({
        isLinkable,
        isSmall,
    })

    const linkProps = isLinkable
        ? {
              component: Link,
              href: socialProfil,
              target: '_blank',
              title: socialProfil,
          }
        : {
              component: 'div',
          }

    return (
        <Box className={classes.speaker} {...linkProps}>
            <Avatar
                src={photoUrl}
                alt={`${t('speakerAvatar')} ${name}`}
                className={classes.avatar + ' ' + classes[size + 'Avatar']}
            />
            <Typography color="textPrimary" className={classes[size + 'Text']}>
                {name}
            </Typography>
        </Box>
    )
}

export default SpeakerItem
