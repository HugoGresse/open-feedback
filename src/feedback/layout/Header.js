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

const Logo = styled.img`
    margin-right: 20px;
`

const HeaderStyled = styled.div`
    top: 0;
    left: auto;
    right: 0;
    position: sticky;
    z-index: 3;
    background: ${COLORS.WHITE};
    box-shadow: 0px 1px 15px ${COLORS.LIGHT_GRAY};
    margin-bottom: 20px;

    .header {
        height: 65px;
        display: flex;
        align-items: center;
    }
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
    display: flex;

    @media screen and (min-width: ${SCREEN_SIZES.MD}) {
        justify-content: flex-start;
        width: 900px;
    }
`

const Header = ({ project }) => {
    const matchParams = useParams()

    return (
        <HeaderStyled>
            <div className="header">
                <IconWrapper left>
                    {matchParams.talkId && (
                        <Link
                            to={`/${matchParams.projectId}/${matchParams.date}`}>
                            <ArrowBack />
                        </Link>
                    )}
                </IconWrapper>
                <IconWrapper right>
                    <a
                        href={project.scheduleLink}
                        target="_blank"
                        rel="noopener noreferrer">
                        <CalendarToday />
                    </a>
                </IconWrapper>
                <BoxCenter>
                    <Logo
                        src={project.logoSmall}
                        width={60}
                        height={60}
                        alt="logo"
                    />
                    <Hidden smDown>
                        <Title component="h1" fontSize={24} fontWeight={400}>
                            {project.name}
                        </Title>
                    </Hidden>
                </BoxCenter>
            </div>
            {!matchParams.talkId && <SearchBar />}
        </HeaderStyled>
    )
}

export default Header
