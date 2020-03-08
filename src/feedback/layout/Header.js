import React from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import { COLORS } from '../../constants/colors'
import Title from '../../baseComponents/design/Title'
import { SCREEN_SIZES } from '../../constants/constants'
import SearchBar from './SearchBar'
import ArrowBack from '@material-ui/icons/ArrowBack'
import CalendarToday from '@material-ui/icons/CalendarToday'
import { Hidden } from '@material-ui/core/es'
import makeStyles from '@material-ui/core/styles/makeStyles'

const Logo = styled.img`
    margin-right: 20px;
`

const IconWrapper = styled.div`
    min-width: 28px;
    position: absolute;
    ${props =>
        props.left &&
        `
        left: 20px;
    `}
    ${props =>
        props.right &&
        `
        right: 20px;
    `}
    svg {
        color: ${COLORS.GRAY};
    }
`

const BoxCenter = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
    align-items: center;
    display: flex;

    @media screen and (min-width: ${SCREEN_SIZES.MD}) {
        justify-content: flex-start;
        width: 900px;
    }
`

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: theme.palette.background.default,
        top: 0,
        left: 'auto',
        right: 0,
        position: 'sticky',
        zIndex: 3,
        background: COLORS.WHITE,
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
                <IconWrapper left>
                    {matchParams.talkId && (
                        <Link
                            to={`/${matchParams.projectId}/${matchParams.date}`}>
                            <ArrowBack />
                        </Link>
                    )}
                </IconWrapper>
                {project.scheduleLink && (
                    <IconWrapper right>
                        <a
                            href={project.scheduleLink}
                            target="_blank"
                            rel="noopener noreferrer">
                            <CalendarToday />
                        </a>
                    </IconWrapper>
                )}
                <BoxCenter>
                    <Logo
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
                </BoxCenter>
            </div>
            {!matchParams.talkId && <SearchBar />}
        </div>
    )
}

export default Header
