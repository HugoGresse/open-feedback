import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getTalksDatesSelector } from '../../core/talks/talksSelectors'
import {
    getProjectSelectedDateSelector,
    getProjectSelector,
} from '../project/projectSelectors'
import { COLORS } from '../../constants/colors'
import { Link } from 'react-router-dom'
import DateTime from 'luxon/src/datetime'

const Menu = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
`

const MenuItem = styled.div`
    color: ${COLORS.LIGHT_GRAY};
    ${props =>
        props.selected &&
        `
        color: ${COLORS.BLACK};
        border-bottom: 2px ${COLORS.RED_ORANGE} solid;
    `};
    a {
        color: inherit;
        margin: 10px;
        display: block;
    }
`

class TalksDateMenu extends Component {
    render() {
        const { talksDates, selectedDate, currentProjectId } = this.props

        return (
            <Menu>
                {talksDates.map(date => (
                    <MenuItem key={date} selected={selectedDate === date}>
                        <Link to={`/${currentProjectId}/${date}`}>
                            {DateTime.fromISO(date).toLocaleString({
                                weekday: 'long',
                                day: 'numeric',
                            })}
                        </Link>
                    </MenuItem>
                ))}
            </Menu>
        )
    }
}

const mapStateToProps = state => ({
    talksDates: getTalksDatesSelector(state),
    selectedDate: getProjectSelectedDateSelector(state),
    currentProjectId: getProjectSelector(state).id,
})

export default connect(mapStateToProps, null)(TalksDateMenu)
