import React, { Component } from 'react'
import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search'
import { setSessionsFilter } from '../../core/sessions/sessionsActions'
import connect from 'react-redux/es/connect/connect'
import { COLORS } from '../../constants/colors'
import { SCREEN_SIZES } from '../../constants/constants'
import BigInput from '../../baseComponents/design/BigInput'
import Box from '../../baseComponents/design/Box'

const SearchBarStyled = styled(Box)`
    margin-top: 10px;
    background-color: ${COLORS.EXTRA_LIGHT_GRAY};
    color: ${COLORS.LIGHT_GRAY};

    .wrapper {
        width: 100%;
        margin-left: auto;
        margin-right: auto;

        @media screen and (min-width: ${SCREEN_SIZES.MD}) {
            width: 900px;
        }
    }
`

class SearchBar extends Component {
    onFilterChanged = event => {
        this.props.setSessionsFilter(event.target.value)
    }

    render() {
        return (
            <SearchBarStyled>
                <div className="wrapper">
                    <BigInput
                        onChange={this.onFilterChanged}
                        icon={<SearchIcon />}
                        placeholder="Search speakers, talks, tags,..."
                    />
                </div>
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
