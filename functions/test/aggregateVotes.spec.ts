import {incrementVoteAggregate} from "../src/triggers/aggregateVotes"

const getMockedFirestore = (docData: {}) => ({
    collection: jest.fn(path => ({
        doc: jest.fn(doc => ({
            collection: jest.fn(path => ({
                doc: jest.fn(newVote => ({
                        get: () => Promise.resolve(({
                                data: () => docData,
                                exists: true
                            })
                        ),
                        set: (data: {}, options: {}) => {
                            return Promise.resolve(data)
                        }
                    })
                )
            }))
        }))
    }))
}) as unknown as FirebaseFirestore.Firestore

describe('incrementVoteAggregate', () => {
    // Boolean vote
    it('successfully increment by one a never voted voteItemId & session', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1'
        }
        const result = await incrementVoteAggregate(getMockedFirestore({}), input.id, input, 1)
        expect(result).toEqual({[input.voteItemId]: 1})
    })
    it('successfully decrement by one a never voted voteItemId & session', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1'
        }
        const result = await incrementVoteAggregate(getMockedFirestore({}), input.id, input, -1)
        expect(result).toEqual({[input.voteItemId]: -1})
    })
    it('successfully increment by one an already voted session & voteItemId', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1'
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: 3
            }),
            input.id,
            input,
            1)
        expect(result).toEqual({[input.voteItemId]: 4})
    })
    it('successfully decrement by one an already voted session & voteItemId', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1'
        }
        const result = await incrementVoteAggregate(
            getMockedFirestore({
                [input.voteItemId]: 3
            }),
            input.id,
            input,
            -1)
        expect(result).toEqual({[input.voteItemId]: 2})
    })

    // Text vote
    it('successfully add text to vote aggregate for a new voteItemId & session', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'toto1'
        }
        const result = await incrementVoteAggregate(getMockedFirestore({}), input.id, input, 1)
        expect(result).toEqual({
            [input.voteItemId]: {
                "1": {
                    "createdAt": undefined,
                    "text": "toto1",
                    "updatedAt": undefined,
                    "userId": "u1",
                }
            }
        })

    })
    it('successfully return an empty object when trying to remove text to vote aggregate for a new voteItemId & session', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'toto1'
        }
        const result = await incrementVoteAggregate(getMockedFirestore({}), input.id, input, -1)
        expect(result).toEqual({
            [input.voteItemId]: {}
        })
    })
    it('successfully add text to vote aggregate for an existing voteItemId & session', async () => {
        const input = {
            id: '2',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'grosminé'
        }

        const result = await incrementVoteAggregate(getMockedFirestore({
            [input.voteItemId]: {
                1: {
                    createdAt: undefined,
                    text: "toto1",
                    updatedAt: undefined,
                    userId: "u1",
                }
            }
        }), input.id, input, 1)

        expect(result).toEqual({
            [input.voteItemId]: {
                1: {
                    createdAt: undefined,
                    text: "toto1",
                    updatedAt: undefined,
                    userId: "u1",
                },
                2: {
                    createdAt: undefined,
                    text: 'grosminé',
                    updatedAt: undefined,
                    userId: 'u1'
                }
            }
        })
    })
    it('successfully remove text to vote aggregate for an existing voteItemId & session', async () => {
        const input = {
            id: '1',
            projectId: 'p1',
            sessionId: 's1',
            voteItemId: 'vi1',
            userId: 'u1',
            text: 'anything'
        }

        const result = await incrementVoteAggregate(getMockedFirestore({
            [input.voteItemId]: {
                1: {
                    createdAt: undefined,
                    text: "toto1",
                    updatedAt: undefined,
                    userId: "u1",
                },
                2: {
                    createdAt: undefined,
                    text: "caritta",
                    updatedAt: undefined,
                    userId: "u2",
                }
            }
        }), input.id, input, -1)

        expect(result).toEqual({
            [input.voteItemId]: {
                1: {},
                2: {
                    createdAt: undefined,
                    text: "caritta",
                    updatedAt: undefined,
                    userId: "u2",
                }
            }
        })
    })
})
