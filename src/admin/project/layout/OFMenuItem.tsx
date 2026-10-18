import { Component, type ReactNode } from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import { NavLinkMui } from './NavLinkMui.tsx'

export interface OFMenuItemProps {
    to: string
    icon: ReactNode
    text: ReactNode
    iconClassName?: string
}

export class OFMenuItem extends Component<OFMenuItemProps> {
    override render() {
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
