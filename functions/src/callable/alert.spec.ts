import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import firebaseFunctionsTest from 'firebase-functions-test'
import { alert } from './alert'

const test = firebaseFunctionsTest()
const alertWrapped = test.wrap(alert)

// Handlers may throw synchronously; normalise to a promise.
const callAlert = async (data: unknown) => alertWrapped({ data } as any)

describe('alert', () => {
    const fetchMock = vi.fn()

    beforeEach(() => {
        vi.stubEnv('OPSGENIE_KEY', 'test-key')
        vi.stubEnv('OPSGENIE_API', 'https://opsgenie.test')
        fetchMock.mockResolvedValue(new Response('ok', { status: 202 }))
        vi.stubGlobal('fetch', fetchMock)
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.unstubAllGlobals()
        fetchMock.mockReset()
    })

    it('rejects empty data with failed-precondition', async () => {
        await expect(callAlert({})).rejects.toMatchObject({
            code: 'failed-precondition',
            message: 'Input parameters are empty',
        })
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rejects with failed-precondition when OpsGenie is not configured', async () => {
        vi.stubEnv('OPSGENIE_KEY', '')

        await expect(callAlert({ message: 'boom' })).rejects.toMatchObject({
            code: 'failed-precondition',
            message: 'Missing credentials for opsgenie',
        })
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('posts the request data to OpsGenie', async () => {
        const data = { message: 'boom', priority: 'P2' }

        await expect(callAlert(data)).resolves.toBe('ok')

        expect(fetchMock).toHaveBeenCalledWith(
            'https://opsgenie.test/v2/alerts',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Authorization: 'GenieKey test-key',
                }),
                body: JSON.stringify(data),
            })
        )
    })
})
