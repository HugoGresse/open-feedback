import { afterEach, describe, expect, test, vi } from 'vitest'
import { JsonUrlApi } from './jsonurl/JsonUrlApi'
import { JsonImportApi } from './jsonimport/JsonImportApi'

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
