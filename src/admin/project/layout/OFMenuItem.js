import React, { Component } from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import NavLinkMui from './NavLinkMui'

class OFMenuItem extends Component {
    render() {
        const { to, icon, text, textClassName } = this.props
        return (
            <ListItem button component={NavLinkMui} to={to}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                    primaryTypographyProps={{
                        color: 'textPrimary'
                    }}
                    className={textClassName}
                    primary={text}
                />
            </ListItem>
        )
    }
}

export default OFMenuItem
