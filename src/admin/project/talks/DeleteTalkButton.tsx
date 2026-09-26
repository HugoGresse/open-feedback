import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import SimpleDialog from '../../baseComponents/layouts/SimpleDialog'
import { removeTalk } from '../../../core/talks/talksActions'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { getTalkVoteCount, shouldConfirmTalkRemoval } from './talkVoteCount'

interface DeleteTalkButtonProps {
    talk: { id: string; title: string }
    // Returns true when the removal must not happen (e.g. read-only project).
    isBlocked: () => boolean
}

const DeleteTalkButton = ({ talk, isBlocked }: DeleteTalkButtonProps) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const projectId: string = useSelector(getSelectedProjectIdSelector)
    const [isChecking, setIsChecking] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    // undefined: dialog closed, null: vote count unknown, number: vote count
    const [voteCount, setVoteCount] = useState<number | null | undefined>()
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    const remove = () => dispatch(removeTalk(talk) as any)

    const onClick = async () => {
        if (isChecking || isBlocked()) return
        setIsChecking(true)
        const count = await getTalkVoteCount(projectId, talk.id).catch(
            () => null
        )
        if (!isMounted.current) return
        setIsChecking(false)
        if (!shouldConfirmTalkRemoval(count)) {
            remove()
            return
        }
        setVoteCount(count)
    }

    const onConfirm = async () => {
        if (isRemoving) return
        setIsRemoving(true)
        await remove()
        if (!isMounted.current) return
        setIsRemoving(false)
        setVoteCount(undefined)
    }

    return (
        <>
            <IconButton
                aria-label="delete"
                onClick={onClick}
                disabled={isChecking}
                size="large"
            >
                <DeleteIcon />
            </IconButton>
            <SimpleDialog
                onClose={() => setVoteCount(undefined)}
                onConfirm={onConfirm}
                title={t('talks.removeConfirmTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('talks.removeConfirmButton')}
                confirmLoading={isRemoving}
                open={voteCount !== undefined}
            >
                <Typography>
                    {voteCount === null
                        ? t('talks.removeConfirmDescUnknown', {
                              title: talk.title,
                          })
                        : t('talks.removeConfirmDesc', {
                              title: talk.title,
                              count: voteCount,
                          })}
                </Typography>
            </SimpleDialog>
        </>
    )
}

export default DeleteTalkButton
