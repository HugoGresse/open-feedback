import { describe, it, expect, vi, beforeEach } from 'vitest'

// Capture every batch.set() call across the test so we can assert on the
// document ids and payloads written to Firestore.
interface RecordedOp {
    collection: string
    docId: string
    data: Record<string, unknown>
    merge: unknown
}

let recordedOps: RecordedOp[] = []
let committedBatches = 0

const makeCollection = (collectionName: string) => ({
    doc: (docId: string) => ({ __collection: collectionName, __docId: docId }),
})

vi.mock('../../../notification/notifcationActions', () => ({
    addNotification: (payload: unknown) => ({ type: 'NOTIFY', payload }),
}))

vi.mock('../../../../firebase', () => ({
    serverTimestamp: () => 'SERVER_TS',
    fireStoreMainInstance: {
        collection: () => ({
            doc: () => ({
                collection: (name: string) => makeCollection(name),
            }),
        }),
        batch: () => {
            const ops: RecordedOp[] = []
            return {
                set: (
                    ref: { __collection: string; __docId: string },
                    data: Record<string, unknown>,
                    options: unknown
                ) => {
                    ops.push({
                        collection: ref.__collection,
                        docId: ref.__docId,
                        data,
                        merge: options,
                    })
                },
                commit: () => {
                    committedBatches++
                    recordedOps.push(...ops)
                    return Promise.resolve()
                },
            }
        },
    },
}))

import { importEventData } from './importEventData'

const run = (projectId: string, data: unknown, dispatch: unknown = () => {}) =>
    (
        importEventData(projectId, data as never) as (
            d: unknown
        ) => Promise<unknown>
    )(dispatch)

describe('importEventData', () => {
    beforeEach(() => {
        recordedOps = []
        committedBatches = 0
    })

    it('writes speakers and talks using the JSON ids as document ids', async () => {
        const summary = (await run('proj1', {
            sessions: {
                t1: { id: 't1', title: 'Talk 1', speakers: ['s1'] },
            },
            speakers: {
                s1: { id: 's1', name: 'Jane' },
            },
        })) as { talkCount: number; speakerCount: number }

        expect(summary).toEqual({ talkCount: 1, speakerCount: 1 })

        const speaker = recordedOps.find((o) => o.collection === 'speakers')
        const talk = recordedOps.find((o) => o.collection === 'talks')

        expect(speaker?.docId).toBe('s1')
        expect(talk?.docId).toBe('t1')
        // serverTimestamp() is stamped on each imported doc.
        expect(speaker?.data.createdAt).toBe('SERVER_TS')
        expect(talk?.data.updatedAt).toBe('SERVER_TS')
        // Writes are merged so re-import is idempotent per id.
        expect(talk?.merge).toEqual({ merge: true })
    })

    it('normalizes numeric ids before writing', async () => {
        await run('proj1', {
            sessions: { 2: { id: 2, title: 'Talk' } },
            speakers: {},
        })
        const talk = recordedOps.find((o) => o.collection === 'talks')
        expect(talk?.docId).toBe('2')
    })

    it('chunks writes into batches under the 500 op Firestore limit', async () => {
        const sessions: Record<string, unknown> = {}
        for (let i = 0; i < 1000; i++) {
            sessions['t' + i] = { id: 't' + i, title: 'T' + i }
        }
        const summary = (await run('proj1', { sessions, speakers: {} })) as {
            talkCount: number
        }

        expect(summary.talkCount).toBe(1000)
        // 1000 talks / 450 per batch => 3 commits (speakers batch is empty/skipped).
        expect(committedBatches).toBe(3)
    })

    it('handles an empty payload without writing anything', async () => {
        const summary = (await run('proj1', {})) as {
            talkCount: number
            speakerCount: number
        }
        expect(summary).toEqual({ talkCount: 0, speakerCount: 0 })
        expect(recordedOps).toHaveLength(0)
        expect(committedBatches).toBe(0)
    })

    it('rejects ids containing a slash and notifies, without writing', async () => {
        const dispatch = vi.fn()
        await expect(
            run(
                'proj1',
                {
                    sessions: { 'a/b': { id: 'a/b', title: 'Bad' } },
                    speakers: {},
                },
                dispatch
            )
        ).rejects.toThrow(/Invalid talk id/)

        // No partial write happened and the user was notified.
        expect(recordedOps).toHaveLength(0)
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'NOTIFY' })
        )
    })
})
