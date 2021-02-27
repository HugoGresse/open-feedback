import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUsersFilterSelector } from './core/usersSelectors'
import OFListHeader from '../baseComponents/layouts/OFListHeader'
import UserInvitePanel from './UserInvitePanel'
import { useTranslation } from 'react-i18next'

const UserListHeader = ({
    onFilterChange,
    onUserInvite,
    userTypes = ['members'],
}) => {
    const filter = useSelector(getUsersFilterSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={onFilterChange}
                buttonProcessing={false}
                buttonClick={() => setSidePanelOpen(true)}
                buttonText={t('users.add')}
            />
            <UserInvitePanel
                isOpen={sidePanelOpen}
                userTypes={userTypes}
                onClose={() => setSidePanelOpen(false)}
                onSubmit={(email, type) =>
                    onUserInvite(email, type).then((success) =>
                        setSidePanelOpen(!success)
                    )
                }
            />
        </>
    )
}

export default UserListHeader
