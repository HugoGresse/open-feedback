import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersFilterSelector } from './usersSelectors'
import { inviteUser, setUsersFilter } from './usersActions'
import OFListHeader from '../../../baseComponents/layouts/OFListHeader'
import UserInvitePanel from './UserInvitePanel'
import { useTranslation } from 'react-i18next'

const UserListHeader = () => {
    const dispatch = useDispatch()
    const filter = useSelector(getUsersFilterSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(setUsersFilter(value))}
                buttonProcessing={false}
                buttonClick={() => setSidePanelOpen(true)}
                buttonText={t('settingsUser.addButton')}
            />
            <UserInvitePanel
                isOpen={sidePanelOpen}
                onClose={() => setSidePanelOpen(false)}
                onSubmit={email =>
                    dispatch(inviteUser(email)).then(success =>
                        setSidePanelOpen(!success)
                    )
                }
            />
        </>
    )
}

export default UserListHeader
