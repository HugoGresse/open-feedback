import { useEffect, useState } from 'react'
import { TalkListItem } from './TalkListItem.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import Grid from '@mui/material/Grid'
import { OFListHeader } from '../../baseComponents/layouts/OFListHeader.tsx'
import {
    getFilteredTalksAsMapSelector,
    getTalksFilterSelector,
} from '../../../core/talks/talksSelectors'
import { setTalksFilter } from '../../../core/talks/talksActions'
import { hideVote, unhideVote } from './moderationActions'
import {
    getTextVotesSelector,
    isTextVotesLoadedSelector,
} from './moderationSelectors'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { SimpleDialog } from '../../baseComponents/layouts/SimpleDialog.tsx'
import { TranslatedTypography } from '../../baseComponents/TranslatedTypography.tsx'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'
import { OFPagination } from '../../baseComponents/layouts/OFPagination.tsx'
import type { ModerationTextVote } from './moderationActionTypes'

const itemPerPage = 10
export const TalkList = () => {
    const dispatch = useAppDispatch()
    const talks = useAppSelector(getFilteredTalksAsMapSelector)
    const votesWithTalkId = useAppSelector(getTextVotesSelector)
    const filter = useAppSelector(getTalksFilterSelector)
    const speakersMap = useAppSelector(getSpeakersListSelector)
    const isVotesLoaded = useAppSelector(isTextVotesLoadedSelector)
    const { t } = useTranslation()

    const [currentPage, setPage] = useState(1)
    const [selectedVote, setSelectedVote] = useState<ModerationTextVote | null>(
        null
    )
    const [changingVote, setChangingVote] = useState<ModerationTextVote | null>(
        null
    )
    const [isVoteStatusChanging, setVoteStatusChange] = useState(false)

    const talkKeys = Object.keys(votesWithTalkId)
    const selectedKeys = talkKeys.slice(
        (currentPage - 1) * itemPerPage,
        (currentPage - 1) * itemPerPage + itemPerPage
    )

    const isChangingVoteHide =
        changingVote && changingVote.status === VOTE_STATUS_ACTIVE

    const movePage = (newPage: number) => {
        setPage(newPage)
    }

    useEffect(() => {
        return () => {
            dispatch(setTalksFilter(null))
        }
    }, [dispatch])

    if (!isVotesLoaded) {
        return <LoaderMatchParent height="200px" />
    }

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={(value: string) =>
                    dispatch(setTalksFilter(value))
                }
            />

            <Grid container component="ul">
                {selectedKeys.map((talkId) => {
                    if (!talks[talkId]) {
                        return ''
                    }

                    return (
                        <TalkListItem
                            talk={talks[talkId]}
                            key={talkId}
                            speakers={speakersMap}
                            votes={votesWithTalkId[talkId]}
                            onSpeakerClicked={(value: string) =>
                                dispatch(setTalksFilter(value))
                            }
                            onVoteExpandClick={setSelectedVote}
                            onVoteHideClick={setChangingVote}
                        />
                    )
                })}

                <OFPagination
                    count={
                        talkKeys ? Math.ceil(talkKeys.length / itemPerPage) : 0
                    }
                    current={currentPage}
                    onChange={(_event: unknown, page: number) => movePage(page)}
                />
            </Grid>

            <SimpleDialog
                onClose={() => setSelectedVote(null)}
                onConfirm={() => setSelectedVote(null)}
                title={'Vote ' + (selectedVote && selectedVote.voteId)}
                confirmText={t('common.close')}
                open={!!selectedVote}
            >
                <Typography>{selectedVote && selectedVote.text}</Typography>
            </SimpleDialog>

            <SimpleDialog
                onClose={() => {
                    setChangingVote(null)
                    setVoteStatusChange(false)
                }}
                onConfirm={async () => {
                    // The dialog is only open while a vote is selected
                    if (!changingVote) {
                        return
                    }
                    setVoteStatusChange(true)
                    if (changingVote.status === VOTE_STATUS_HIDDEN) {
                        await dispatch(unhideVote(changingVote))
                    } else {
                        await dispatch(hideVote(changingVote))
                    }
                    setChangingVote(null)
                    setVoteStatusChange(false)
                }}
                title={t(
                    isChangingVoteHide
                        ? 'moderation.hideDialogTitle'
                        : 'moderation.unhideDialogTitle'
                )}
                confirmText={t(
                    isChangingVoteHide
                        ? 'moderation.hideDialogTitle'
                        : 'moderation.unhideDialogConfirm'
                )}
                cancelText={t('common.cancel')}
                open={!!changingVote}
                confirmLoading={isVoteStatusChanging}
            >
                <TranslatedTypography
                    i18nKey={
                        isChangingVoteHide
                            ? 'moderation.hideDialogDescription'
                            : 'moderation.unhideDialogDescription'
                    }
                />
            </SimpleDialog>
        </>
    )
}
