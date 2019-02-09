import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'
import { getSessionsDates } from './core/sessionSelectors'
import {
    getProjectSelectedDate,
    getProjectSelector
} from '../project/projectSelectors'
import { COLORS } from '../../constants/colors'
import { Link } from 'react-router-dom'

const Menu = styled.div`
    display: flex;
    justify-content: center;
`

const MenuItem = styled.span`
    color: ${COLORS.LIGHT_GRAY};
    padding: 10px;
    ${props =>
        props.selected &&
        `
        color: ${COLORS.BLACK}
        border-bottom: 2px ${COLORS.RED_ORANGE} solid
    `};
`

class SessionDateMenu extends Component {
    render() {
        const { sessionsDates, selectedDate, currentProjectId } = this.props
        return (
            <Menu>
                {sessionsDates.map(date => (
                    <Link key={date} to={`/${currentProjectId}/${date}`}>
                        <MenuItem selected={selectedDate === date}>
                            {moment(date).format('dddd D')}
                        </MenuItem>
                    </Link>
                ))}
            </Menu>
        )
    }
}

const mapStateToProps = state => ({
    sessionsDates: getSessionsDates(state),
    selectedDate: getProjectSelectedDate(state),
    currentProjectId: getProjectSelector(state).id
})

export default connect(
    mapStateToProps,
    null
)(SessionDateMenu)
