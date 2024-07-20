import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUsersFilterSelector } from './core/usersSelectors'
import OFListHeader from '../baseComponents/layouts/OFListHeader.jsx'
import UserInvitePanel from './UserInvitePanel.jsx'
import { useTranslation } from 'react-i18next'

const UserListHeader = ({
    onFilterChange,
    onUserInvite,
    onSidePanelOpen,
    usersDetails,
    userTypes = ['members'],
}) => {
    const filter = useSelector(getUsersFilterSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const { t } = useTranslation()

    const openSidePanel = () => {
        setSidePanelOpen(true)
        onSidePanelOpen && onSidePanelOpen()
    }

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={onFilterChange}
                buttonProcessing={false}
                buttonClick={openSidePanel}
                buttonText={t('users.add')}
            />
            <UserInvitePanel
                isOpen={sidePanelOpen}
                userTypes={userTypes}
                usersDetails={usersDetails}
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
