import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'

// From https://github.com/mui-org/material-ui/issues/7956#issuecomment-326908167
// Fix issue with MUI v4
const createNavLink = (props, ref) => <NavLink innerRef={ref} {...props} />
export const NavLinkMui = forwardRef(createNavLink)
