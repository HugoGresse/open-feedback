import React, { Component } from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import NavLinkMui from './NavLinkMui'

class OFMenuItem extends Component {
    render() {
        const { to, icon, text, iconClassName } = this.props
        return (
            <ListItem button component={NavLinkMui} to={to}>
                <ListItemIcon className={iconClassName}>{icon}</ListItemIcon>
                <ListItemText
                    primaryTypographyProps={{
                        color: 'textPrimary'
                    }}
                    primary={text}
                />
            </ListItem>
        )
    }
}

export default OFMenuItem
