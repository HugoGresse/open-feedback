import React, { useState } from 'react'
import OFButton from '../../../baseComponents/button/OFButton.jsx'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import CircularProgress from '@mui/material/CircularProgress'
import { deleteProject } from '../../core/actions/deleteProject'
import { useNavigate } from 'react-router-dom'

export const DeleteProject = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const projectId = useSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isDeleting, setDeleteState] = useState(false)

    return (
        <>
            <OFButton
                style={{ design: 'text' }}
                onClick={() => setDialogOpen(true)}
            >
                <DeleteForeverIcon />
                {t('settingsSetup.deleteEvent.button')}
            </OFButton>

            <Dialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    style={{ background: '#FF2222', color: 'white' }}
                >
                    {t('settingsSetup.deleteEvent.confirmTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <br />
                        <b>
                            {t('settingsSetup.deleteEvent.confirmDescription')}
                        </b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <OFButton
                        disabled={isDeleting}
                        onClick={() => setDialogOpen(false)}
                        style={{ design: 'text' }}
                    >
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        onClick={() => {
                            setDeleteState(true)
                            dispatch(deleteProject(projectId, t))
                                .then(() => {
                                    navigate('/admin')
                                })
                                .catch(() => {
                                    setDeleteState(false)
                                    // nothing to do
                                })
                        }}
                        disabled={isDeleting}
                        style={{ customBg: '#FF2222' }}
                    >
                        {t('settingsSetup.deleteEvent.button')}
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
