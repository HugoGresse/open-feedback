import { Component } from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import { NavLinkMui } from './NavLinkMui.tsx'

export class OFMenuItem extends Component {
    render() {
        const { to, icon, text, iconClassName } = this.props
        return (
            <ListItem button component={NavLinkMui} to={to}>
                <ListItemIcon className={iconClassName}>{icon}</ListItemIcon>
                <ListItemText
                    primaryTypographyProps={{
                        color: 'textPrimary',
                    }}
                    primary={text}
                />
            </ListItem>
        )
    }
}
