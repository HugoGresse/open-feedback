import { describe, it, expect } from 'vitest'
import {
    incrementVoteAggregate,
    normalizeVoteTimestamps,
} from './aggregateVotes'
import {
    Vote,
    VOTE_STATUS_DELETED,
    VOTE_STATUS_ACTIVE,
    VoteData,
} from './models/vote'
import * as admin from 'firebase-admin'
export const FieldValue = admin.firestore.FieldValue
import { vi } from 'vitest'

const getMockedFirestore = (docData: Record<string, unknown>) =>
    ({
        collection: vi.fn(() => ({
            doc: vi.fn(() => ({
                collection: vi.fn(() => ({
                    doc: vi.fn(() => ({
                        get: () =>
                            Promise.resolve({
                                data: () => docData,
                                exists: true,
                            }),
                        set: (
                            data: Record<string, unknown>,
                            options: Record<string, unknown>
                        ) => {
                            return Promise.resolve(data)
                        },
                    })),
                })),
            })),
        })),
    }) as unknown as FirebaseFirestore.Firestore

describe('incrementVoteAggregate', () => {
    // Boolean vote
    it('successfully increment by one a never voted voteItemId & talk', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            status: VOTE_STATUS_ACTIVE,
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
            status: VOTE_STATUS_DELETED,
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
            status: VOTE_STATUS_ACTIVE,
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
            status: VOTE_STATUS_DELETED,
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
            status: VOTE_STATUS_ACTIVE,
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
                    plus: 1,
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
            status: VOTE_STATUS_DELETED,
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
            status: VOTE_STATUS_ACTIVE,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {
                        createdAt: {},
                        text: 'toto1',
                        plus: 1,
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
                    plus: 1,
                    updatedAt: {},
                    userId: 'u1',
                },
                2: {
                    createdAt: {},
                    text: 'grosminé',
                    plus: 1,
                    updatedAt: {},
                    userId: 'u1',
                },
            },
        })
    })

    it('successfully add vote (plus) on a text vote item', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            status: VOTE_STATUS_ACTIVE,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {
                        createdAt: {},
                        text: 'toto1',
                        plus: 1,
                        updatedAt: {},
                        userId: 'u1',
                    },
                },
            }),
            new Vote('1', input)
        )

        expect(result).toEqual({ [input.voteItemId]: FieldValue.increment(1) })
    })
    it('successfully add a text vote on a text vote item where the user already upVoted another text', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'secondUser',
            text: 'New vote',
            status: VOTE_STATUS_ACTIVE,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {
                        createdAt: {},
                        text: 'toto1',
                        plus: 2,
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
                    plus: 2,
                    updatedAt: {},
                    userId: 'u1',
                },
                2: {
                    createdAt: {},
                    text: 'New vote',
                    plus: 1,
                    updatedAt: {},
                    userId: 'secondUser',
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
            status: VOTE_STATUS_DELETED,
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

describe('normalizeVoteTimestamps', () => {
    const makeSnapshot = (
        data: Record<string, unknown>,
        createTime: unknown,
        updateTime: unknown
    ) =>
        ({
            data: () => data,
            createTime,
            updateTime,
        }) as unknown as FirebaseFirestore.DocumentSnapshot

    const baseData = {
        projectId: 'p1',
        talkId: 's1',
        voteItemId: 'vi1',
        userId: 'u1',
        status: VOTE_STATUS_ACTIVE,
    }

    it('fills createdAt/updatedAt from createTime/updateTime when null', () => {
        const createTime = { _label: 'createTime' }
        const updateTime = { _label: 'updateTime' }
        const result = normalizeVoteTimestamps(
            makeSnapshot(
                { ...baseData, createdAt: null, updatedAt: null },
                createTime,
                updateTime
            )
        )

        expect(result.createdAt).toBe(createTime)
        expect(result.updatedAt).toBe(updateTime)
    })

    it('fills createdAt/updatedAt when fields are undefined', () => {
        const createTime = { _label: 'createTime' }
        const updateTime = { _label: 'updateTime' }
        const result = normalizeVoteTimestamps(
            makeSnapshot({ ...baseData }, createTime, updateTime)
        )

        expect(result.createdAt).toBe(createTime)
        expect(result.updatedAt).toBe(updateTime)
    })

    it('keeps existing timestamps untouched', () => {
        const createdAt = { _label: 'voteCreatedAt' }
        const updatedAt = { _label: 'voteUpdatedAt' }
        const result = normalizeVoteTimestamps(
            makeSnapshot(
                { ...baseData, createdAt, updatedAt },
                { _label: 'createTime' },
                { _label: 'updateTime' }
            )
        )

        expect(result.createdAt).toBe(createdAt)
        expect(result.updatedAt).toBe(updatedAt)
    })
})
