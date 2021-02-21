import React from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItem, Select } from '@material-ui/core'
import OFInput from '../../baseComponents/form/input/OFInput'

export const UserRoleSelect = ({
    selectedUserRole,
    userTypes,
    onRoleChange,
    disabled,
}) => {
    const { t } = useTranslation()
    if (!userTypes.length) {
        return selectedUserRole
    }

    return (
        <Select
            value={selectedUserRole}
            disabled={disabled}
            input={<OFInput />}
            onChange={(event) => onRoleChange(event.target.value)}>
            {userTypes.map((type) => (
                <MenuItem key={type} value={type}>
                    {t(`users.${type}`)}
                </MenuItem>
            ))}
        </Select>
    )
}
