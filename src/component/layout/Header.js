import { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import React from 'react'
import { COLORS } from '../../constants/colors'
import Title from '../design/Title'
import { SPACING } from '../../constants/constants'
import SearchBar from './SearchBar'
import Box from '../design/Box'
import { Link } from 'react-router-dom'
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
`

const IconWrapper = styled.div`
    min-width: 28px;
    svg {
        color: ${COLORS.GRAY};
    }
`

class Header extends Component {
    render() {
        const { logo, match } = this.props
        console.log(match.params.sessionId)
        return (
            <HeaderStyled>
                <Box
                    px={[SPACING.HEADER / 2, SPACING.HEADER]}
                    py={10}
                    flex
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <IconWrapper>
                        {match.params.sessionId && (
                            <Link
                                to={`/${match.params.projectId}/${
                                    match.params.date
                                }`}
                            >
                                <ArrowBack />
                            </Link>
                        )}
                    </IconWrapper>

                    <Box flex>
                        <Logo src={logo} width={60} height={60} alt="logo" />
                        <Hidden smDown>
                            <Title
                                component="h1"
                                fontSize={24}
                                fontWeight={400}
                            >
                                Sunny Tech
                            </Title>
                        </Hidden>
                    </Box>
                    <IconWrapper>
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <CalendarToday />
                        </a>
                    </IconWrapper>
                </Box>
                {!match.params.sessionId && <SearchBar />}
            </HeaderStyled>
        )
    }
}

Header.propTypes = {
    logo: PropTypes.string.isRequired,
    displayHeader: PropTypes.bool
}

export default withRouter(Header)
