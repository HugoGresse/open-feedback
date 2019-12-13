import React from 'react'
import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search'
import { setTalksFilter } from '../../core/talks/talksActions'
import { COLORS } from '../../constants/colors'
import { SCREEN_SIZES } from '../../constants/constants'
import BigInput from '../../baseComponents/design/BigInput'
import Box from '../../baseComponents/design/Box'
import { useDispatch } from 'react-redux'

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

const SearchBar = () => {
    const dispatch = useDispatch()

    return (
        <SearchBarStyled>
            <div className="wrapper">
                <BigInput
                    onChange={event =>
                        dispatch(setTalksFilter(event.target.value))
                    }
                    icon={<SearchIcon />}
                    className="search"
                    placeholder="Search speakers, talks, tags,..."
                />
            </div>
        </SearchBarStyled>
    )
}
export default SearchBar
