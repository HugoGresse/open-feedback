import React from 'react'
import { Link, useParams } from 'react-router-dom'
import SearchBar from './SearchBar'
import ArrowBack from '@material-ui/icons/ArrowBack'
import CalendarToday from '@material-ui/icons/CalendarToday'
import { Hidden } from '@material-ui/core/es'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { grey } from '@material-ui/core/colors'
import { darken } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import { isInIFrame } from '../utils/isInIFrame'
import useQuery from '../../utils/useQuery'

const useStyles = makeStyles((theme) => ({
    logo: {
        marginRight: 20,
        maxHeight: 60,
        maxWidth: 200,
    },
    iconLeft: {
        minWidth: 28,
        position: 'absolute',
        top: 0,
        '& a': {
            padding: 18,
            display: 'block',
            transition: 'background-color 200ms',
            '&:hover': {
                backgroundColor: darken(theme.palette.pageBackground, 0.2),
            },
        },
        '& svg': {
            color: theme.palette.textDimmed,
        },
    },
    iconRight: {
        minWidth: 28,
        position: 'absolute',
        right: 20,

        '& svg': {
            color: grey[600],
        },
    },
    boxCenter: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-start',
            width: 900,
        },
    },
    container: {
        backgroundColor: theme.palette.pageBackground,
        top: 0,
        left: 'auto',
        right: 0,
        position: (props) => (props.inIFrame ? 'relative' : 'sticky'),
        zIndex: 3,
        boxShadow: (props) =>
            props.inIFrame
                ? 'none'
                : `0px 1px 15px ${theme.palette.headerShadow}`,
        marginBottom: 20,
    },
    header: {
        height: 65,
        display: 'flex',
        alignItems: 'center',
    },
}))

export const Header = ({ project }) => {
    const classes = useStyles({
        inIFrame: isInIFrame(),
    })
    const { t } = useTranslation()
    const matchParams = useParams()
    const hideHeader = useQuery().get('hideHeader')

    if (hideHeader && hideHeader === 'true') {
        return null
    }

    return (
        <header className={classes.container}>
            <div className={classes.header}>
                <div className={classes.iconLeft}>
                    {matchParams.talkId && (
                        <Link
                            title={t('talks.list')}
                            to={`/${matchParams.projectId}/${matchParams.date}`}
                        >
                            <ArrowBack color="primary" />
                        </Link>
                    )}
                </div>
                {project.scheduleLink && (
                    <div className={classes.iconRight}>
                        <a
                            href={project.scheduleLink}
                            target="_blank"
                            title={`${project.name} website`}
                            rel="noopener noreferrer"
                        >
                            <CalendarToday />
                        </a>
                    </div>
                )}
                <div className={classes.boxCenter}>
                    <img
                        className={classes.logo}
                        src={project.logoSmall}
                        alt={`logo ${project.name}`}
                    />
                    <Hidden smDown>
                        <Typography
                            variant="h1"
                            color="textPrimary"
                            aria-label={project.hideEventName && project.name}
                        >
                            {!project.hideEventName && project.name}
                        </Typography>
                    </Hidden>
                </div>
            </div>
            {!matchParams.talkId && <SearchBar />}
        </header>
    )
}
