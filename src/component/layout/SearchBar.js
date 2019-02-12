import { Component } from 'react'
import styled from 'styled-components'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { setSessionsFilter } from '../sessions/core/sessionsActions'
import connect from 'react-redux/es/connect/connect'
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/constants'
import BigInput from '../design/BigInput'
import Box from '../design/Box'

const SearchBarStyled = styled(Box)`
    background-color: ${COLORS.EXTRA_LIGHT_GRAY};
    color: ${COLORS.LIGHT_GRAY};
`

class SearchBar extends Component {
    onFilterChanged = event => {
        this.props.setSessionsFilter(event.target.value)
    }

    render() {
        return (
            <SearchBarStyled
                pr={[SPACING.HEADER / 2, SPACING.HEADER]}
                pl={[0, SPACING.HEADER]}
            >
                <BigInput
                    onChange={this.onFilterChanged}
                    icon={<SearchIcon />}
                    placeholder="Search speakers, talks, tags,..."
                />
            </SearchBarStyled>
        )
    }
}

const mapDispatchToProps = Object.assign(
    {},
    { setSessionsFilter: setSessionsFilter }
)

export default connect(
    null,
    mapDispatchToProps
)(SearchBar)
