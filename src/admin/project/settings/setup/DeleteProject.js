import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import OFButton from '../../../baseComponents/button/OFButton'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { useTranslation } from 'react-i18next'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import CircularProgress from '@material-ui/core/CircularProgress'
import { deleteProject } from '../../core/actions/deleteProject'

export const DeleteProject = () => {
    const history = useHistory()
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
                                    history.push('/admin')
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
