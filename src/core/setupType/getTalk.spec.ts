import { afterEach, describe, expect, test, vi } from 'vitest'
import { JsonUrlApi } from './jsonurl/JsonUrlApi'
import { JsonImportApi } from './jsonimport/JsonImportApi'
import { OpenfeedbackApi } from './openfeedback/OpefeedbackApi'

const talkDoc = vi.hoisted(() => ({
    exists: false,
    data: (): Record<string, unknown> | undefined => undefined,
}))

vi.mock('../../firebase.ts', () => ({
    serverTimestamp: () => 'serverTimestamp',
    fireStoreMainInstance: {
        collection: () => ({
            doc: () => ({
                collection: () => ({
                    doc: (id: string) => ({
                        get: () => Promise.resolve({ id, ...talkDoc }),
                    }),
                }),
            }),
        }),
    },
}))

const fetchMock = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchMock)

const sessions = {
    t1: { id: 't1', title: 'Talk 1', speakers: [], tags: [] },
}

afterEach(() => {
    fetchMock.mockReset()
})

describe('JsonUrlApi.getTalk', () => {
    const setupApi = () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ sessions, speakers: {} }))
        )
        return new JsonUrlApi({ jsonUrl: 'point-to-nowhere.json' })
    }

    test('returns the talk keyed by its id', async () => {
        const talks = await setupApi().getTalk('t1')
        expect(talks).toEqual({ t1: sessions.t1 })
    })

    test('returns no talk for an unknown id', async () => {
        const talks = await setupApi().getTalk('unknown')
        expect(talks).toStrictEqual({})
    })
})

describe('JsonImportApi.getTalk', () => {
    test('returns the talk keyed by its id', async () => {
        const api = new JsonImportApi({ jsonData: { sessions } })
        expect(await api.getTalk('t1')).toEqual({ t1: sessions.t1 })
    })

    test('returns no talk for an unknown id', async () => {
        const api = new JsonImportApi({ jsonData: { sessions } })
        expect(await api.getTalk('unknown')).toStrictEqual({})
    })
})

describe('OpenfeedbackApi.getTalk', () => {
    test('returns the talk keyed by its id', async () => {
        talkDoc.exists = true
        talkDoc.data = () => ({ title: 'Talk 1' })

        const talks = await new OpenfeedbackApi('p1').getTalk('t1')

        expect(talks).toEqual({ t1: { id: 't1', title: 'Talk 1' } })
    })

    test('returns no talk for a missing talk document', async () => {
        talkDoc.exists = false
        talkDoc.data = () => undefined

        const talks = await new OpenfeedbackApi('p1').getTalk('deleted')

        expect(talks).toStrictEqual({})
    })
})
