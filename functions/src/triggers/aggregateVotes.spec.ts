import { incrementVoteAggregate } from './aggregateVotes'
import {
    Vote,
    VOTE_MODE_DECREMENT,
    VOTE_MODE_INCREMENT,
    VoteData,
} from './models/Vote'
import firebase from 'firebase'
import FieldValue = firebase.firestore.FieldValue

const getMockedFirestore = (docData: {}) =>
    (({
        collection: jest.fn(path => ({
            doc: jest.fn(doc => ({
                collection: jest.fn(secondPath => ({
                    doc: jest.fn(newVote => ({
                        get: () =>
                            Promise.resolve({
                                data: () => docData,
                                exists: true,
                            }),
                        set: (data: {}, options: {}) => {
                            return Promise.resolve(data)
                        },
                    })),
                })),
            })),
        })),
    } as unknown) as FirebaseFirestore.Firestore)

describe('incrementVoteAggregate', () => {
    // Boolean vote
    it('successfully increment by one a never voted voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            mode: VOTE_MODE_INCREMENT,
            createdAt: {},
            updatedAt: {},
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({}),
            new Vote('1', input)
        )
        expect(result).toEqual({ [input.voteItemId]: FieldValue.increment(1) })
    })
    it('successfully decrement by one a never voted voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            mode: VOTE_MODE_DECREMENT,
            createdAt: {},
            updatedAt: {},
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({}),
            new Vote('1', input)
        )
        expect(result).toEqual({ [input.voteItemId]: FieldValue.increment(-1) })
    })
    it('successfully increment by one an already voted talk & voteItemId', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            mode: VOTE_MODE_INCREMENT,
            createdAt: {},
            updatedAt: {},
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: 3,
            }),
            new Vote('1', input)
        )
        expect(result).toEqual({ [input.voteItemId]: FieldValue.increment(1) })
    })
    it('successfully decrement by one an already voted talk & voteItemId', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            mode: VOTE_MODE_DECREMENT,
            createdAt: {},
            updatedAt: {},
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: 3,
            }),
            new Vote('1', input)
        )
        expect(result).toEqual({ [input.voteItemId]: FieldValue.increment(-1) })
    })

    // Text vote
    it('successfully add text to vote aggregate for a new voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'toto1',
            mode: VOTE_MODE_INCREMENT,
            createdAt: {},
            updatedAt: {},
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({}),
            new Vote('1', input)
        )
        expect(result).toEqual({
            [input.voteItemId]: {
                '1': {
                    createdAt: {},
                    text: 'toto1',
                    updatedAt: {},
                    userId: 'u1',
                },
            },
        })
    })
    it('successfully return an empty object when trying to remove text to vote aggregate for a new voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'toto1',
            mode: VOTE_MODE_DECREMENT,
            createdAt: {},
            updatedAt: {},
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({}),
            new Vote('1', input)
        )
        expect(result).toEqual({
            [input.voteItemId]: {},
        })
    })
    it('successfully add text to vote aggregate for an existing voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'grosminé',
            mode: VOTE_MODE_INCREMENT,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {
                        createdAt: {},
                        text: 'toto1',
                        updatedAt: {},
                        userId: 'u1',
                    },
                },
            }),
            new Vote('2', input)
        )

        expect(result).toEqual({
            [input.voteItemId]: {
                1: {
                    createdAt: {},
                    text: 'toto1',
                    updatedAt: {},
                    userId: 'u1',
                },
                2: {
                    createdAt: {},
                    text: 'grosminé',
                    updatedAt: {},
                    userId: 'u1',
                },
            },
        })
    })
    it('successfully remove text to vote aggregate for an existing voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'anything',
            mode: VOTE_MODE_DECREMENT,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {
                        createdAt: undefined,
                        text: 'toto1',
                        updatedAt: undefined,
                        userId: 'u1',
                    },
                    2: {
                        createdAt: undefined,
                        text: 'caritta',
                        updatedAt: undefined,
                        userId: 'u2',
                    },
                },
            }),
            new Vote('1', input)
        )

        expect(result).toEqual({
            [input.voteItemId]: {
                1: {},
                2: {
                    createdAt: undefined,
                    text: 'caritta',
                    updatedAt: undefined,
                    userId: 'u2',
                },
            },
        })
    })
})
