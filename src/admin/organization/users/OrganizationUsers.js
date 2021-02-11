import React from 'react'
import UserListHeader from '../../project/settings/users/UserListHeader'

/**
 * This is a WIP and has been merged to reduce review overflow
 *
 * Missing part:
 * 1. make users a separate folder and try to make it generic for project and orgs
 * 2. Display users from org
 * 3. Manage more roles
 * 4. Add roles guides/explanation.
 * @returns {JSX.Element}
 * @constructor
 */
export const OrganizationUsers = () => {
    return (
        <>
            <div>
                Organization are work in progress and has been merged to prevent
                review overflow. While voting form and theme are not currently
                working, organizations user roles are available directly within
                the DB.
            </div>
            <UserListHeader />
        </>
    )
}
