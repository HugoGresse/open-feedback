import { Component } from 'react'
import styled from 'styled-components'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import * as sessionActions from '../session/core/sessionActions'
import connect from 'react-redux/es/connect/connect'
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/constants'
import BigInput from '../design/BigInput'

const SearchBarStyled = styled.div`
    background-color: ${COLORS.EXTRA_LIGHT_GRAY};
    padding: 0 ${SPACING.HEADER};
`

class SearchBar extends Component {
    onFilterChanged = event => {
        this.props.setSessionFilter(event.target.value)
    }

    render() {
        return (
            <SearchBarStyled>
                <BigInput
                    onChange={this.onFilterChanged}
                    icon={<SearchIcon />}
                    placeholder="Search speakers, talks, tags,..."
                />
            </SearchBarStyled>
        )
    }
}

const mapDispatchToProps = Object.assign({}, sessionActions)

export default connect(
    null,
    mapDispatchToProps
)(SearchBar)
