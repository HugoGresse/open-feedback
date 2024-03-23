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
import { resetProjectVotes } from '../../core/actions/resetProjectVotes'

export const ResetVotes = () => {
    const dispatch = useDispatch()
    const projectId = useSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isOngoing, setOngoing] = useState(false)
    const [update, setUpdate] = useState(null)

    return (
        <>
            <OFButton
                style={{ design: 'text' }}
                onClick={() => setDialogOpen(true)}
            >
                <DeleteForeverIcon />
                {t('settingsSetup.resetVotes.button')}
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
                    {t('settingsSetup.resetVotes.confirmTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <br />
                        <b>
                            {t('settingsSetup.resetVotes.confirmDescription')}
                        </b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <OFButton
                        disabled={isOngoing}
                        onClick={() => setDialogOpen(false)}
                        style={{ design: 'text' }}
                    >
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        onClick={() => {
                            setOngoing(true)
                            dispatch(
                                resetProjectVotes(
                                    projectId,
                                    t,
                                    (totalDocs, deletedDocs) => {
                                        setUpdate([totalDocs, deletedDocs])
                                    }
                                )
                            )
                                .then(() => {
                                    setOngoing(false)
                                    setDialogOpen(false)
                                })
                                .catch(() => {
                                    setOngoing(false)
                                })
                        }}
                        disabled={isOngoing}
                        style={{ customBg: '#FF2222' }}
                    >
                        {t('settingsSetup.resetVotes.button')}
                        {isOngoing && (
                            <CircularProgress
                                style={{
                                    height: 20,
                                    width: 20,
                                    color: 'white',
                                    marginLeft: 10,
                                }}
                            />
                        )}
                        {update &&
                            (update[1]
                                ? ` ${update[1]}/${update[0]}`
                                : ` ${update[0]}`)}
                    </OFButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
