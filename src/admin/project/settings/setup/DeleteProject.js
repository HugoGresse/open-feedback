import React, { useState } from 'react'
import OFButton from '../../../baseComponents/OFButton'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProject } from '../../core/projectActions'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'

const DeleteProject = () => {
    const dispatch = useDispatch()
    const projectId = useSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()
    const [isDialogOpen, setDialogOpen] = useState(false)

    return (
        <Box
            textAlign="center"
            borderTop="1px solid #ccc"
            marginTop={5}
            paddingTop={4}>
            <OFButton
                style={{ design: 'text' }}
                onClick={() => setDialogOpen(true)}>
                <DeleteForeverIcon />
                {t('settingsSetup.deleteEvent.button')}
            </OFButton>

            <Dialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle
                    id="alert-dialog-title"
                    style={{ background: '#FF2222', color: 'white' }}>
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
                        onClick={() => setDialogOpen(false)}
                        style={{ design: 'text' }}>
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        onClick={() => dispatch(deleteProject(projectId))}
                        style={{ customBg: '#FF2222' }}>
                        {t('settingsSetup.deleteEvent.button')}
                    </OFButton>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DeleteProject
