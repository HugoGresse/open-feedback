export const VOTE_MODE_INCREMENT: 'increment' = 'increment'
export const VOTE_MODE_DECREMENT: 'decrement' = 'decrement'

export type VoteMode = typeof VOTE_MODE_INCREMENT | typeof VOTE_MODE_DECREMENT

export interface VoteData {
    projectId: string
    talkId: string
    voteItemId: string
    createdAt: object
    updatedAt: object
    userId: string
    text?: string
    mode: VoteMode
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

    public isTextVote(): boolean {
        return !!this.voteData.text
    }

    public willIncrement(): boolean {
        return this.voteData.mode === VOTE_MODE_INCREMENT || !this.voteData.mode
    }

    public getIncrementValue(): number {
        switch (this.voteData.mode) {
            case VOTE_MODE_INCREMENT:
                return 1
            case VOTE_MODE_DECREMENT:
                return -1
            default:
                return 0
        }
    }
}
const isIdValid = (id: any): boolean => {
    return id && id.length > 0
}
