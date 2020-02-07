export const VOTE_STATUS_ACTIVE: 'active' = 'active'
export const VOTE_STATUS_DELETED: 'deleted' = 'deleted'

export type VoteStatus = typeof VOTE_STATUS_ACTIVE | typeof VOTE_STATUS_DELETED

export interface VoteData {
    projectId: string
    talkId: string
    voteItemId: string
    createdAt: object
    updatedAt: object
    userId: string
    text?: string
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
            !isIdValid(this.voteData.status) ||
            !this.id
        ) {
            return false
        }
        return true
    }

    public isTextVote(): boolean {
        return !!this.voteData.text
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
}
const isIdValid = (id: any): boolean => {
    return id && id.length > 0
}
