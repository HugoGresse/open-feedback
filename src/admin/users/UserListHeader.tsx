import { useState } from 'react'
import { getUsersFilterSelector } from './core/usersSelectors'
import { OFListHeader } from '../baseComponents/layouts/OFListHeader.tsx'
import { UserInvitePanel } from './UserInvitePanel.tsx'
import { useTranslation } from 'react-i18next'
import type { User } from '../../core/models'
import { useAppSelector } from '../../store'

export interface UserListHeaderProps {
    onFilterChange: (value: string) => void
    /** Resolves to a truthy value when the invite succeeded. */
    onUserInvite: (email: string, userType: string) => Promise<unknown>
    onSidePanelOpen?: () => void
    /** Users suggested in the invite email autocomplete. */
    usersDetails?: Record<string, User>
    userTypes?: readonly string[]
}

export const UserListHeader = ({
    onFilterChange,
    onUserInvite,
    onSidePanelOpen,
    usersDetails,
    userTypes = ['members'],
}: UserListHeaderProps) => {
    const filter = useAppSelector(getUsersFilterSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const { t } = useTranslation()

    const openSidePanel = () => {
        setSidePanelOpen(true)
        onSidePanelOpen?.()
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
