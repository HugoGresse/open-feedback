import { describe, it, expect } from 'vitest'
import {
    getVoteUpdates,
    incrementVoteAggregate,
    normalizeVoteTimestamps,
} from './aggregateVotes'
import {
    Vote,
    VOTE_STATUS_DELETED,
    VOTE_STATUS_ACTIVE,
    VOTE_TYPE_TEXT_PLUS,
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
        // Only this text vote is written, as an empty (deleted) entry
        expect(result).toEqual({
            [input.voteItemId]: { 1: {} },
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

        // The merge write leaves the other text votes untouched
        expect(result).toEqual({
            [input.voteItemId]: {
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
    it('keeps the up-votes of a text vote when its author edits the text', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'edited',
            status: VOTE_STATUS_ACTIVE,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {
                        createdAt: {},
                        text: 'original',
                        plus: 3,
                        updatedAt: {},
                        userId: 'u1',
                    },
                },
            }),
            new Vote('1', input)
        )

        // The merge write keeps the current plus (no stale copy of it)
        expect(result).toEqual({
            [input.voteItemId]: {
                1: {
                    createdAt: {},
                    text: 'edited',
                    updatedAt: {},
                    userId: 'u1',
                },
            },
        })
    })
    it('resets the up-votes of a text vote written again after its deletion', async () => {
        const input: VoteData = {
            projectId: 'p1',
            talkId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'back again',
            status: VOTE_STATUS_ACTIVE,
            createdAt: {},
            updatedAt: {},
        }

        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: {
                    1: {},
                },
            }),
            new Vote('1', input)
        )

        expect(result).toEqual({
            [input.voteItemId]: {
                1: {
                    createdAt: {},
                    text: 'back again',
                    plus: 1,
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
            [input.voteItemId]: { 1: {} },
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

describe('getVoteUpdates', () => {
    const voteData = (fields: Partial<VoteData>): VoteData => ({
        projectId: 'p1',
        talkId: 's1',
        voteItemId: 'vi1',
        userId: 'u1',
        status: VOTE_STATUS_ACTIVE,
        createdAt: {},
        updatedAt: {},
        ...fields,
    })
    const update = (before: Partial<VoteData>, after: Partial<VoteData>) =>
        getVoteUpdates(
            new Vote('1', voteData(before)),
            new Vote('1', voteData(after))
        ).map((vote) => vote.voteData)

    it('counts a status change', () => {
        expect(update({ status: VOTE_STATUS_DELETED }, {})).toEqual([
            voteData({}),
        ])
        expect(update({}, { status: VOTE_STATUS_DELETED })).toEqual([
            voteData({ status: VOTE_STATUS_DELETED }),
        ])
    })

    it('does not count again a write that keeps the status', () => {
        expect(update({}, {})).toEqual([])
        expect(
            update(
                { status: VOTE_STATUS_DELETED },
                { status: VOTE_STATUS_DELETED }
            )
        ).toEqual([])
    })

    it('aggregates the edit of an active text vote', () => {
        expect(update({ text: 'old' }, { text: 'new' })).toEqual([
            voteData({ text: 'new' }),
        ])
    })

    it('moves an active up-vote to another text vote', () => {
        const upVote = { voteType: VOTE_TYPE_TEXT_PLUS } as const
        expect(
            update({ ...upVote, voteId: 'A' }, { ...upVote, voteId: 'B' })
        ).toEqual([
            voteData({
                ...upVote,
                voteId: 'A',
                status: VOTE_STATUS_DELETED,
            }),
            voteData({ ...upVote, voteId: 'B' }),
        ])
    })
})
