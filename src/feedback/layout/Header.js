import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Title from './Title'
import SearchBar from './SearchBar'
import ArrowBack from '@material-ui/icons/ArrowBack'
import CalendarToday from '@material-ui/icons/CalendarToday'
import { Hidden } from '@material-ui/core/es'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { grey } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    logo: {
        marginRight: 20,
    },
    iconLeft: {
        minWidth: 28,
        position: 'absolute',
        left: 20,
        '& svg': {
            color: grey[600],
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
        position: 'sticky',
        zIndex: 3,
        boxShadow: `0px 1px 15px ${theme.palette.headerShadow}`,
        marginBottom: 20,
    },
    header: {
        height: 65,
        display: 'flex',
        alignItems: 'center',
    },
}))

const Header = ({ project }) => {
    const classes = useStyles()
    const matchParams = useParams()

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.iconLeft}>
                    {matchParams.talkId && (
                        <Link
                            to={`/${matchParams.projectId}/${matchParams.date}`}>
                            <ArrowBack />
                        </Link>
                    )}
                </div>
                {project.scheduleLink && (
                    <div className={classes.iconRight}>
                        <a
                            href={project.scheduleLink}
                            target="_blank"
                            rel="noopener noreferrer">
                            <CalendarToday />
                        </a>
                    </div>
                )}
                <div className={classes.boxCenter}>
                    <img
                        className={classes.logo}
                        src={project.logoSmall}
                        width={60}
                        height={60}
                        alt="logo"
                    />
                    <Hidden smDown>
                        <Title component="h1" color="textPrimary">
                            {project.name}
                        </Title>
                    </Hidden>
                </div>
            </div>
            {!matchParams.talkId && <SearchBar />}
        </div>
    )
}

export default Header
