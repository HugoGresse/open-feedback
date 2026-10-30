import { type KeyboardEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import EditIcon from '@mui/icons-material/Edit'
import { getOrganizationNameToSave } from '../utils/organizationNameEdit'

export interface OrganizationNameProps {
    name: string
    editable: boolean
    onSave: (name: string) => Promise<void>
}

/**
 * The organization name, edited in place when clicked: saved on blur or Enter,
 * Escape cancels the edit.
 */
export const OrganizationName = ({
    name,
    editable,
    onSave,
}: OrganizationNameProps) => {
    const { t } = useTranslation()
    const [isEditing, setEditing] = useState(false)
    const [draftName, setDraftName] = useState(name)
    // Displayed until the saved organization is reloaded, to avoid a flicker
    const [savingName, setSavingName] = useState<string | null>(null)
    // Enter/Escape end the edit, the blur fired afterward must not save again
    const isEditEnded = useRef(false)

    const startEdit = () => {
        if (!editable) return
        isEditEnded.current = false
        setDraftName(name)
        setEditing(true)
    }

    const endEdit = (save: boolean) => {
        if (isEditEnded.current) return
        isEditEnded.current = true
        setEditing(false)

        const nameToSave = save
            ? getOrganizationNameToSave(name, draftName)
            : null
        if (!nameToSave) return
        setSavingName(nameToSave)
        onSave(nameToSave).finally(() => setSavingName(null))
    }

    const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            endEdit(true)
        } else if (event.key === 'Escape') {
            // Do not close the organization modal
            event.stopPropagation()
            endEdit(false)
        }
    }

    if (isEditing) {
        return (
            <InputBase
                autoFocus
                fullWidth
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onFocus={(event) => event.target.select()}
                onBlur={() => endEdit(true)}
                onKeyDown={onInputKeyDown}
                inputProps={{
                    'aria-label': t('organization.name'),
                    name: 'organizationName',
                }}
                sx={(theme) => ({
                    ...theme.typography.h2,
                    color: theme.palette.primary.main,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    '& .MuiInputBase-input': {
                        padding: 0,
                        height: 'auto',
                    },
                })}
            />
        )
    }

    const displayedName = savingName ?? name
    const editLabel: string = t('organization.editName')

    if (!editable) {
        return (
            <Typography variant="h2" color="primary">
                {displayedName}
            </Typography>
        )
    }

    return (
        <Typography
            variant="h2"
            color="primary"
            role="button"
            tabIndex={0}
            title={editLabel}
            onClick={startEdit}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    startEdit()
                }
            }}
            sx={{
                cursor: 'text',
                borderBottom: '2px solid transparent',
                '& .editIcon': { opacity: 0, transition: 'opacity 0.2s' },
                '&:hover .editIcon, &:focus-visible .editIcon': {
                    opacity: 0.6,
                },
            }}
        >
            {displayedName}
            <EditIcon
                className="editIcon"
                fontSize="small"
                sx={{ marginLeft: 1, verticalAlign: 'middle' }}
            />
        </Typography>
    )
}
