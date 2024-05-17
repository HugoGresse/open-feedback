import { Navigate, Outlet, useLocation } from 'react-router-dom'
import React from 'react'

/**
 * This allows users to skip the last "/" for example "/admin" will be redirected to "/admin/"
 * From https://stackoverflow.com/a/77391833/1377145
 */
export const EnforceTrailingSlash = () =>  {
    const { pathname } = useLocation()
    if (!pathname.endsWith('/')) {
        return <Navigate to={`${pathname}/`} />
    }
    return <Outlet />
}
