import { createAppSelector, type RootState } from '../../../store'
import {
    getProjectVoteResultsSelector,
    getProjectVoteStartEndTimeSelector,
    hideVotesUntilUserVoteSelector,
} from '../../project/projectSelectors'
import { getSelectedTalkIdSelector } from './talkSelectors'
import { isVoteWindowOpen } from '../../vote/checkDataBeforeVote'
import { shouldShowVoteResults } from './voteResultsVisibility'
import type { AggregatedTextVote } from '../../../core/models'

/** A text vote of the results, its Firestore timestamps turned into dates. */
export interface TextVoteResult
    extends Omit<AggregatedTextVote, 'id' | 'createdAt' | 'updatedAt'> {
    /** The vote id. */
    id: string
    createdAt: Date | null
    updatedAt: Date
}

/**
 * Value of a vote item in the results: the counter of a boolean vote item or
 * the text votes of a text vote item (the `id` key holds the talk id).
 */
export type VoteResult = number | string | TextVoteResult[] | undefined

/** Vote results of the selected talk keyed by vote item id. */
export type VoteResults = Record<string, VoteResult>

export const getVoteResultSelectorSelector = createAppSelector(
    getSelectedTalkIdSelector,
    getProjectVoteResultsSelector,
    hideVotesUntilUserVoteSelector,
    getProjectVoteStartEndTimeSelector,
    (_: RootState, displayVotes: string | null) => displayVotes,
    (_: RootState, _displayVotes: string | null, votedOnTalkAtLoad: boolean) =>
        votedOnTalkAtLoad,
    (
        selectedTalkId,
        voteResults,
        hideVotesUntilUserVote,
        projectVotesWindow,
        displayVotes,
        votedOnTalkAtLoad
    ): VoteResults => {
        const [voteStartTime, voteEndTime] = projectVotesWindow
        // Without both dates, the vote window is always open
        const voteWindowOpen =
            !voteStartTime ||
            !voteEndTime ||
            isVoteWindowOpen(voteStartTime, voteEndTime)[0]
        if (
            !shouldShowVoteResults({
                hideVotesUntilUserVote,
                displayVotes,
                votedOnTalkAtLoad,
                voteWindowOpen,
            })
        ) {
            return {}
        }
        if (
            !voteResults ||
            selectedTalkId === null ||
            !voteResults[selectedTalkId]
        ) {
            return {}
        }
        const results = voteResults[selectedTalkId]

        // Transform results.id.{ id: voteText1, id: voteText2, id: voteText3} into an array
        const transformResult: VoteResults = {}
        Object.entries(results).forEach(([key, value]) => {
            if (typeof value === 'object') {
                const textVotes: TextVoteResult[] = []
                Object.entries(value).forEach(([voteId, value2]) => {
                    const keys = Object.keys(value2)
                    if (
                        !value2 ||
                        keys.length === 0 ||
                        (keys.length === 1 && keys[0] === 'id')
                    ) {
                        // Empty object due to deletion
                        return
                    }
                    // A regression (Gen2 trigger migration) wrote some
                    // aggregated votes with null createdAt/updatedAt. Guard
                    // the .toDate() calls so one bad entry can't crash the
                    // whole results view; fall back to whichever date exists.
                    const updatedAt =
                        value2.updatedAt?.toDate?.() ??
                        value2.createdAt?.toDate?.() ??
                        null
                    const createdAt = value2.createdAt?.toDate?.() ?? updatedAt
                    if (!updatedAt) {
                        // No usable timestamp, skip this corrupted entry
                        return
                    }
                    textVotes.push({
                        ...value2,
                        // The id is copied in the value when loading the votes
                        id: value2.id ?? voteId,
                        updatedAt,
                        createdAt,
                    })
                })
                transformResult[key] = textVotes.sort(
                    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
                )
            } else {
                transformResult[key] = value
            }
        })

        return transformResult
    }
)
