import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'
import { getSessionsDates } from './core/sessionsSelectors'
import {
    getProjectSelectedDate,
    getProjectSelector
} from '../project/projectSelectors'
import { COLORS } from '../../constants/colors'
import { Link } from 'react-router-dom'

const Menu = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
`

const MenuItem = styled.div`
    color: ${COLORS.LIGHT_GRAY};
    /* padding: 10px; */
    ${props =>
        props.selected &&
        `
        color: ${COLORS.BLACK}
        border-bottom: 2px ${COLORS.RED_ORANGE} solid
    `};
    a {
        color: inherit;
        margin: 10px;
        display: block;
    }
`

class SessionsDateMenu extends Component {
    render() {
        const { sessionsDates, selectedDate, currentProjectId } = this.props
        return (
            <Menu>
                {sessionsDates.map(date => (
                    <MenuItem key={date} selected={selectedDate === date}>
                        <Link to={`/${currentProjectId}/${date}`}>
                            {moment(date).format('dddd D')}
                        </Link>
                    </MenuItem>
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
)(SessionsDateMenu)
