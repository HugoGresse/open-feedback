import { forwardRef } from 'react'
import { NavLink, type NavLinkProps } from 'react-router-dom'

// From https://github.com/mui-org/material-ui/issues/7956#issuecomment-326908167
// Fix issue with MUI v4
export const NavLinkMui = forwardRef<HTMLAnchorElement, NavLinkProps>(
    function NavLinkMui(props, ref) {
        return <NavLink ref={ref} {...props} />
    }
)
