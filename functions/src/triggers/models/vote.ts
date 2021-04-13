import { firestoreIncrement } from '../../helpers/firebaseInit'
import { AggregatedVote } from './AggregatedVote'
import { VoteItemAggregationChange } from './VoteItemAggregationChange'

export const VOTE_STATUS_ACTIVE: 'active' = 'active'
export const VOTE_STATUS_DELETED: 'deleted' = 'deleted'

export type VoteStatus = typeof VOTE_STATUS_ACTIVE | typeof VOTE_STATUS_DELETED
export const VOTE_TYPE_TEXT_PLUS = 'textPlus'

export interface VoteData {
    projectId: string
    talkId: string
    voteItemId: string
    createdAt: object
    updatedAt: object
    userId: string
    text?: string
    plus?: number
    voteId?: string // only for textPlus vote
    voteType?: typeof VOTE_TYPE_TEXT_PLUS | undefined
    status: VoteStatus
}

export class Vote {
    constructor(public id: string, public voteData: VoteData) {}

    public isValid(): boolean {
        // noinspection RedundantIfStatementJS
        if (
            !isIdValid(this.voteData.projectId) ||
            !isIdValid(this.voteData.talkId) ||
            !isIdValid(this.voteData.voteItemId) ||
            !isIdValid(this.voteData.userId) ||
            !this.id
        ) {
            return false
        }
        return true
    }

    public isTextVoteItem(): boolean {
        return !!this.voteData.text || this.isTextPlusVote()
    }

    public isTextPlusVote(): boolean {
        // vote on a text vote item
        return this.voteData.voteType === VOTE_TYPE_TEXT_PLUS
    }

    public isActive(): boolean {
        return this.voteData.status === VOTE_STATUS_ACTIVE
    }

    public getIncrementValue(): number {
        switch (this.voteData.status) {
            case VOTE_STATUS_ACTIVE:
                return 1
            case VOTE_STATUS_DELETED:
                return -1
            default:
                return 0
        }
    }

    public getVoteItemIncrementAggregation(
        snapshotExists: boolean,
        aggregatedVote?: AggregatedVote
    ): VoteItemAggregationChange {
        if (this.isTextVoteItem()) {
            return this.getTextVoteItemAggregation(
                snapshotExists,
                aggregatedVote
            )
        }
        return this.getBooleanVoteItemAggregation()
    }

    private getTextVoteItemAggregation(
        snapshotExists: boolean,
        aggregatedVote?: AggregatedVote
    ): VoteItemAggregationChange {
        if (this.isTextPlusVote()) {
            if (!this.voteData.voteId) {
                return {}
            }
            return {
                [this.voteData.voteItemId]: {
                    [this.voteData.voteId]: {
                        plus: firestoreIncrement(this.getIncrementValue()),
                    },
                },
            }
        }

        let aggregatedValue
        const voteText = {
            text: this.voteData.text,
            createdAt: this.voteData.createdAt,
            updatedAt: this.voteData.updatedAt,
            userId: this.voteData.userId,
        }
        if (this.isActive()) {
            if (
                !snapshotExists ||
                !aggregatedVote ||
                !aggregatedVote[this.voteData.voteItemId]
            ) {
                aggregatedValue = {
                    [this.id]: {
                        ...voteText,
                        plus: 1,
                    },
                }
            } else {
                aggregatedValue = {
                    ...aggregatedVote[this.voteData.voteItemId],
                    [this.id]: {
                        ...voteText,
                        plus: 1,
                    },
                }
            }
        } else {
            if (
                !snapshotExists ||
                !aggregatedVote ||
                !aggregatedVote[this.voteData.voteItemId]
            ) {
                aggregatedValue = {}
            } else {
                aggregatedValue = aggregatedVote[this.voteData.voteItemId]
                aggregatedValue[this.id] = {}
            }
        }
        return {
            [this.voteData.voteItemId]: aggregatedValue,
        }
    }

    private getBooleanVoteItemAggregation(): VoteItemAggregationChange {
        return {
            [this.voteData.voteItemId]: firestoreIncrement(
                this.getIncrementValue()
            ),
        }
    }
}

const isIdValid = (id: any): boolean => {
    return id && id.length > 0
}
