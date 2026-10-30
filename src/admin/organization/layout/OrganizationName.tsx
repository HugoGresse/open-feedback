import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import ButtonBase from '@mui/material/ButtonBase'
import EditIcon from '@mui/icons-material/Edit'
import { getOrganizationNameToSave } from '../utils/organizationName'
import { isComposingKeyEvent } from '../../../utils/isComposingKeyEvent'

export interface OrganizationNameProps {
    name: string
    editable: boolean
    // Resolves once the saved organization is reloaded
    onSave: (name: string) => Promise<void>
}

/**
 * The organization name (page heading), edited in place when clicked: saved
 * on blur or Enter, Escape cancels the edit.
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
    // Keyboard users get the focus back on the name once the edit ends
    const restoreFocus = useRef(false)
    const nameButtonRef = useRef<HTMLButtonElement>(null)

    const displayedName = savingName ?? name

    useEffect(() => {
        if (!isEditing && restoreFocus.current) {
            restoreFocus.current = false
            nameButtonRef.current?.focus()
        }
    }, [isEditing])

    const startEdit = () => {
        isEditEnded.current = false
        setDraftName(displayedName)
        setEditing(true)
    }

    const endEdit = (save: boolean) => {
        if (isEditEnded.current) return
        isEditEnded.current = true
        setEditing(false)

        const nameToSave = save
            ? getOrganizationNameToSave(displayedName, draftName)
            : null
        if (!nameToSave) return
        setSavingName(nameToSave)
        onSave(nameToSave).finally(() =>
            // A newer save may be ongoing, keep displaying its name
            setSavingName((current) =>
                current === nameToSave ? null : current
            )
        )
    }

    const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (isComposingKeyEvent(event)) return
        if (event.key === 'Enter') {
            event.preventDefault()
            restoreFocus.current = true
            endEdit(true)
        } else if (event.key === 'Escape') {
            // Do not close the organization modal
            event.stopPropagation()
            restoreFocus.current = true
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

    return (
        <Typography variant="h2" color="primary">
            {editable ? (
                <ButtonBase
                    ref={nameButtonRef}
                    disableRipple
                    title={t('organization.editName')}
                    onClick={startEdit}
                    sx={{
                        font: 'inherit',
                        color: 'inherit',
                        textAlign: 'left',
                        cursor: 'text',
                        borderBottom: '2px solid transparent',
                        '& .editIcon': {
                            opacity: 0,
                            transition: 'opacity 0.2s',
                        },
                        '&:hover .editIcon, &.Mui-focusVisible .editIcon': {
                            opacity: 0.6,
                        },
                    }}
                >
                    {displayedName}
                    <EditIcon
                        className="editIcon"
                        fontSize="small"
                        sx={{ marginLeft: 1 }}
                    />
                </ButtonBase>
            ) : (
                displayedName
            )}
        </Typography>
    )
}
