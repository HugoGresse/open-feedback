import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import { OFInput } from '../../baseComponents/form/input/OFInput.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import { getSortedProjectsByOrganizationIdsSelector } from '../../project/core/projectSelectors'
import { deleteOrganization } from '../core/actions/deleteOrganization'
import { isOrganizationDeleteConfirmed } from '../utils/organizationNameEdit'

const DANGER_COLOR = '#FF2222'

export interface DeleteOrganizationProps {
    organizationId: string
    organizationName: string
    onDeleted: () => void
}

export const DeleteOrganization = ({
    organizationId,
    organizationName,
    onDeleted,
}: DeleteOrganizationProps) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const eventCount = useAppSelector(
        (state) =>
            getSortedProjectsByOrganizationIdsSelector(state)[organizationId]
                ?.projects.length ?? 0
    )
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [typedName, setTypedName] = useState('')

    const hasEvents = eventCount > 0
    const canDelete =
        !hasEvents &&
        !isDeleting &&
        isOrganizationDeleteConfirmed(organizationName, typedName)

    const closeDialog = () => {
        if (isDeleting) return
        setDialogOpen(false)
        setTypedName('')
    }

    const onConfirm = () => {
        if (!canDelete) return
        setDeleting(true)
        dispatch(deleteOrganization(organizationId)).then((deleted) => {
            setDeleting(false)
            if (deleted) {
                onDeleted()
            }
        })
    }

    return (
        <>
            <OFButton
                style={{ design: 'text', customText: DANGER_COLOR }}
                onClick={() => setDialogOpen(true)}
            >
                <DeleteForeverIcon />
                {t('organization.delete.button')}
            </OFButton>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                aria-labelledby="delete-org-dialog-title"
                aria-describedby="delete-org-dialog-description"
            >
                <DialogTitle
                    id="delete-org-dialog-title"
                    style={{ background: DANGER_COLOR, color: 'white' }}
                >
                    {t('organization.delete.confirmTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="delete-org-dialog-description"
                        component="div"
                    >
                        <br />
                        {hasEvents ? (
                            <b>
                                {t('organization.delete.hasEventsDescription', {
                                    count: eventCount,
                                })}
                            </b>
                        ) : (
                            <>
                                <b>
                                    {t(
                                        'organization.delete.confirmDescription'
                                    )}
                                </b>
                                <p>
                                    {t('organization.delete.typeName', {
                                        name: organizationName,
                                    })}
                                </p>
                            </>
                        )}
                    </DialogContentText>
                    {!hasEvents && (
                        <Box marginTop={1}>
                            <OFInput
                                autoFocus
                                name="confirmOrganizationName"
                                placeholder={organizationName}
                                value={typedName}
                                disabled={isDeleting}
                                onChange={(event) =>
                                    setTypedName(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') onConfirm()
                                }}
                                inputProps={{
                                    'aria-label': t(
                                        'organization.delete.typeNameLabel'
                                    ),
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <OFButton
                        disabled={isDeleting}
                        onClick={closeDialog}
                        style={{ design: 'text' }}
                    >
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        onClick={onConfirm}
                        disabled={!canDelete}
                        style={{
                            customBg: DANGER_COLOR,
                            // Keep it readable while disabled
                            color: 'white',
                            opacity: canDelete || isDeleting ? 1 : 0.5,
                        }}
                    >
                        {t('organization.delete.button')}
                        {isDeleting && (
                            <CircularProgress
                                style={{
                                    height: 20,
                                    width: 20,
                                    color: 'white',
                                    marginLeft: 10,
                                }}
                            />
                        )}
                    </OFButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
