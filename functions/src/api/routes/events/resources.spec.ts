import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import { FastifyInstance } from 'fastify'
import { FakeFirestore } from 'firestore-vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'

const project = {
    id: 'event_123',
    name: 'Synthetic Event',
    organizationId: 'org_123',
    owner: 'owner_123',
    members: ['owner_123'],
    setupType: 'openfeedbackv1',
    _collections: {
        speakers: [
            {
                id: 'speaker_1',
                name: 'Alex Example',
                photoUrl: 'https://example.test/avatar.png',
                privateField: 'never expose',
            },
        ],
        talks: [
            {
                id: 'talk_1',
                title: 'Original Talk',
                speakers: ['speaker_1'],
                startTime: '2030-09-30T18:00:00Z',
                tags: ['cloud'],
            },
        ],
        sessionVotes: [{ id: 'talk_1', clarity: 7 }],
    },
}
const headers = { 'x-api-key': 'oforg_valid' }

let db: FakeFirestore

describe.each(['talks', 'speakers'] as const)('%s API', (kind) => {
    let server: FastifyInstance

    beforeAll(() => {
        mockFirebaseAdminApp({})
        // Keep the API modules and their DAO spies in the same module graph.
        // Each test still receives a fresh database through this closure.
        vi.doMock('firebase-admin/firestore', () => ({
            getFirestore: () => db,
            FieldValue: FakeFirestore.FieldValue,
            FieldPath: FakeFirestore.FieldPath,
        }))
    })

    beforeEach(async () => {
        vi.resetAllMocks()
        db = new FakeFirestore(
            { projects: [structuredClone(project)] },
            { mutable: true }
        )
        const { OrganizationDao } = await import('../../dao/OrganizationDao')
        const { ProjectDao } = await import('../../dao/ProjectDao')
        vi.spyOn(
            OrganizationDao,
            'getOrganizationFromApiKey'
        ).mockResolvedValue({
            id: 'org_123',
            name: 'Synthetic Organization',
            ownerUserId: 'owner_123',
            adminUserIds: [],
            editorUserIds: [],
        })
        vi.spyOn(ProjectDao, 'getProjectFromApiKey').mockResolvedValue(project)
        const { createFastifyAPI } = await import('../../api')
        server = await createFastifyAPI()
    })

    afterEach(async () => {
        await server?.close()
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    const recordId = kind === 'talks' ? 'talk_1' : 'speaker_1'
    const field = kind === 'talks' ? 'title' : 'name'
    const original = kind === 'talks' ? 'Original Talk' : 'Alex Example'
    const url = `/events/${project.id}/${kind}`
    const recordUrl = `${url}/${recordId}`

    it.each(['oforg_valid', 'ofproj_valid'])(
        'lists public fields using an authorized key: %s',
        async (key) => {
            // Arrange
            const requestHeaders = { 'x-api-key': key }

            // Act
            const response = await server.inject({
                method: 'GET',
                url,
                headers: requestHeaders,
            })

            // Assert
            expect(response.statusCode).toBe(200)
            expect(response.json()).toEqual({
                id: project.id,
                [kind]: [
                    {
                        id: recordId,
                        revision: expect.stringMatching(/^[a-f0-9]{64}$/),
                        [field]: original,
                        ...(kind === 'talks'
                            ? { speakers: ['speaker_1'] }
                            : {}),
                    },
                ],
                nextCursor: null,
            })
        }
    )

    it('reads one record without exposing private fields', async () => {
        // Arrange
        const request = { method: 'GET' as const, url: recordUrl, headers }

        // Act
        const response = await server.inject(request)

        // Assert
        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({
            id: recordId,
            revision: expect.stringMatching(/^[a-f0-9]{64}$/),
            [field]: original,
            ...(kind === 'talks' ? { speakers: ['speaker_1'] } : {}),
        })
    })

    it.each(['oforg_valid', 'ofproj_valid'])(
        'creates a record with a stable ID: %s',
        async (key) => {
            // Arrange
            const payload = {
                id: 'new_record',
                [field]: 'New value',
                ...(kind === 'talks' ? { speakers: ['speaker_1'] } : {}),
            }

            // Act
            const response = await server.inject({
                method: 'POST',
                url,
                headers: { 'x-api-key': key },
                payload,
            })
            const stored = (
                await db
                    .collection('projects')
                    .doc(project.id)
                    .collection(kind)
                    .doc('new_record')
                    .get()
            ).data()

            // Assert
            expect(response.statusCode).toBe(201)
            expect(response.json()).toEqual({ id: 'new_record' })
            expect(stored).toMatchObject({
                [field]: 'New value',
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })
        }
    )

    it('generates an ID when none is supplied', async () => {
        // Arrange
        const payload = { [field]: 'New value' }

        // Act
        const response = await server.inject({
            method: 'POST',
            url,
            headers,
            payload,
        })
        const record = response.json()
        const read = await server.inject({
            method: 'GET',
            url: `${url}/${record.id}`,
            headers,
        })

        // Assert
        expect(response.statusCode).toBe(201)
        expect(record.id).toMatch(/^[a-zA-Z0-9_-]+$/)
        expect(read.json()).toMatchObject({
            id: record.id,
            [field]: 'New value',
            ...(kind === 'talks' ? { speakers: [] } : {}),
        })
    })

    it('rejects an existing ID without replacing its data', async () => {
        // Arrange
        const payload = { id: recordId, [field]: 'Replacement' }

        // Act
        const response = await server.inject({
            method: 'POST',
            url,
            headers,
            payload,
        })
        const read = await server.inject({
            method: 'GET',
            url: recordUrl,
            headers,
        })

        // Assert
        expect(response.statusCode).toBe(409)
        expect(read.json()[field]).toBe(original)
    })

    it.each(['oforg_valid', 'ofproj_valid'])(
        'updates one record and preserves metadata and votes: %s',
        async (key) => {
            // Arrange
            const snapshot = (
                await server.inject({ method: 'GET', url: recordUrl, headers })
            ).json()
            const payload = {
                revision: snapshot.revision,
                [field]: 'Edited value',
            }

            // Act
            const response = await server.inject({
                method: 'PATCH',
                url: recordUrl,
                headers: { 'x-api-key': key },
                payload,
            })
            const event = db.collection('projects').doc(project.id)
            const record = (
                await event.collection(kind).doc(recordId).get()
            ).data()
            const votes = (
                await event.collection('sessionVotes').doc('talk_1').get()
            ).data()

            // Assert
            expect(response.statusCode).toBe(200)
            expect(response.json()).toEqual({ id: recordId })
            expect(record).toMatchObject({
                [field]: 'Edited value',
                ...(kind === 'talks'
                    ? {
                          speakers: ['speaker_1'],
                          startTime: '2030-09-30T18:00:00Z',
                          tags: ['cloud'],
                      }
                    : {
                          photoUrl: 'https://example.test/avatar.png',
                          privateField: 'never expose',
                      }),
            })
            expect(votes).toEqual({ clarity: 7 })
        }
    )

    it('rejects stale revisions even when a human changed an omitted field', async () => {
        // Arrange
        const snapshot = (
            await server.inject({ method: 'GET', url: recordUrl, headers })
        ).json()
        const ref = db
            .collection('projects')
            .doc(project.id)
            .collection(kind)
            .doc(recordId)
        await ref.update({ manualMetadata: 'Human edit' })

        // Act
        const response = await server.inject({
            method: 'PATCH',
            url: recordUrl,
            headers,
            payload: {
                revision: snapshot.revision,
                [field]: 'Automation edit',
            },
        })
        const record = (await ref.get()).data()

        // Assert
        expect(response.statusCode).toBe(409)
        expect(record).toMatchObject({
            [field]: original,
            manualMetadata: 'Human edit',
        })
    })

    it('keeps revisions stable for an unchanged update', async () => {
        // Arrange
        const snapshot = (
            await server.inject({ method: 'GET', url: recordUrl, headers })
        ).json()

        // Act
        const response = await server.inject({
            method: 'PATCH',
            url: recordUrl,
            headers,
            payload: { revision: snapshot.revision, [field]: original },
        })
        const after = (
            await server.inject({ method: 'GET', url: recordUrl, headers })
        ).json()

        // Assert
        expect(response.statusCode).toBe(200)
        expect(after).toEqual(snapshot)
    })

    it.each(['GET', 'POST', 'PATCH'] as const)(
        'requires authentication: %s',
        async (method) => {
            // Arrange
            const target = method === 'PATCH' ? recordUrl : url
            const payload =
                method === 'GET'
                    ? undefined
                    : {
                          [field]: 'Value',
                          ...(method === 'PATCH'
                              ? { revision: 'a'.repeat(64) }
                              : {}),
                      }

            // Act
            const response = await server.inject({
                method,
                url: target,
                payload,
            })

            // Assert
            expect(response.statusCode).toBe(401)
        }
    )

    it.each(['GET', 'POST', 'PATCH'] as const)(
        'conceals events outside the authenticated organization: %s',
        async (method) => {
            // Arrange
            await db
                .collection('projects')
                .doc(project.id)
                .update({ organizationId: 'another_org' })
            const target = method === 'PATCH' ? recordUrl : url
            const payload =
                method === 'GET'
                    ? undefined
                    : {
                          [field]: 'Value',
                          ...(method === 'PATCH'
                              ? { revision: 'a'.repeat(64) }
                              : {}),
                      }

            // Act
            const response = await server.inject({
                method,
                url: target,
                headers,
                payload,
            })

            // Assert
            expect(response.statusCode).toBe(404)
        }
    )

    it.each(['GET', 'POST', 'PATCH'] as const)(
        'rejects a key for a different event: %s',
        async (method) => {
            // Arrange
            const { ProjectDao } = await import('../../dao/ProjectDao')
            vi.mocked(ProjectDao.getProjectFromApiKey).mockResolvedValue({
                ...project,
                id: 'other_event',
            })
            const target = method === 'PATCH' ? recordUrl : url
            const payload =
                method === 'GET'
                    ? undefined
                    : {
                          [field]: 'Value',
                          ...(method === 'PATCH'
                              ? { revision: 'a'.repeat(64) }
                              : {}),
                      }

            // Act
            const response = await server.inject({
                method,
                url: target,
                headers: { 'x-api-key': 'ofproj_valid' },
                payload,
            })

            // Assert
            expect(response.statusCode).toBe(404)
        }
    )

    it.each(['jsonurl', 'hoverboardv2'])(
        'preserves external data sources: %s',
        async (setupType) => {
            // Arrange
            await db
                .collection('projects')
                .doc(project.id)
                .update({ setupType })

            // Act
            const response = await server.inject({
                method: 'POST',
                url,
                headers,
                payload: { [field]: 'Value' },
            })

            // Assert
            expect(response.statusCode).toBe(403)
        }
    )

    it.each(['GET', 'PATCH'] as const)(
        'does not create a missing record: %s',
        async (method) => {
            // Arrange
            const payload =
                method === 'PATCH'
                    ? { revision: 'a'.repeat(64), [field]: 'Value' }
                    : undefined

            // Act
            const response = await server.inject({
                method,
                url: `${url}/missing`,
                headers,
                payload,
            })

            // Assert
            expect(response.statusCode).toBe(404)
        }
    )

    it.each([
        { id: '__reserved__' },
        { id: 'bad/id' },
        { revision: 'a'.repeat(64) },
        { email: 'private@example.test' },
        { votes: {} },
        { createdAt: 'fake' },
    ])('rejects protected or invalid creation fields: %j', async (extra) => {
        // Arrange
        const payload = { [field]: 'Value', ...extra }

        // Act
        const response = await server.inject({
            method: 'POST',
            url,
            headers,
            payload,
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it.each(['', ' ', null, 123])(
        'rejects invalid display text: %j',
        async (value) => {
            // Arrange
            const payload = { [field]: value }

            // Act
            const response = await server.inject({
                method: 'POST',
                url,
                headers,
                payload,
            })

            // Assert
            expect(response.statusCode).toBe(400)
        }
    )

    it.each([
        {},
        { revision: 'a'.repeat(64) },
        { revision: 'invalid', name: 'Value' },
        { revision: 'a'.repeat(64), id: 'replacement' },
    ])('rejects invalid partial updates: %j', async (payload) => {
        // Arrange
        const target = recordUrl

        // Act
        const response = await server.inject({
            method: 'PATCH',
            url: target,
            headers,
            payload,
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it.each([
        'limit=0',
        'limit=101',
        'limit=abc',
        'after=bad%2Fid',
        'extra=true',
    ])('validates pagination: %s', async (query) => {
        // Arrange
        const target = `${url}?${query}`

        // Act
        const response = await server.inject({
            method: 'GET',
            url: target,
            headers,
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('paginates with the last returned document ID', async () => {
        // Arrange
        // The Firestore fake does not implement ordering or cursors. Supply the
        // SDK page snapshots and verify the query arguments separately.
        const first = { id: 'record_a', data: () => ({ [field]: 'First' }) }
        const second = { id: 'record_b', data: () => ({ [field]: 'Second' }) }
        vi.spyOn(FakeFirestore.CollectionReference.prototype, '_get')
            .mockReturnValueOnce({ docs: [first, second], size: 2 } as never)
            .mockReturnValueOnce({ docs: [second], size: 1 } as never)
        const after = vi.spyOn(FakeFirestore.Query.prototype, 'startAfter')
        const order = vi.spyOn(FakeFirestore.Query.prototype, 'orderBy')
        const limit = vi.spyOn(FakeFirestore.Query.prototype, 'limit')

        // Act
        const pageOne = (
            await server.inject({
                method: 'GET',
                url: `${url}?limit=1`,
                headers,
            })
        ).json()
        const pageTwo = (
            await server.inject({
                method: 'GET',
                url: `${url}?limit=1&after=${pageOne.nextCursor}`,
                headers,
            })
        ).json()

        // Assert
        expect(pageOne[kind].map((item: { id: string }) => item.id)).toEqual([
            'record_a',
        ])
        expect(pageOne.nextCursor).toBe('record_a')
        expect(pageTwo[kind].map((item: { id: string }) => item.id)).toEqual([
            'record_b',
        ])
        expect(pageTwo.nextCursor).toBeNull()
        expect(after).toHaveBeenCalledWith('record_a')
        expect(order).toHaveBeenCalledWith(FakeFirestore.FieldPath.documentId())
        expect(limit).toHaveBeenCalledWith(2)
    })

    it('reads legacy records with loose IDs and missing fields', async () => {
        // Arrange
        await db
            .collection('projects')
            .doc(project.id)
            .collection(kind)
            .doc('legacy.1')
            .set({ [field]: { en: 'Not a string' }, speakers: 'speaker_1' })

        // Act
        const list = await server.inject({ method: 'GET', url, headers })
        const read = await server.inject({
            method: 'GET',
            url: `${url}/legacy.1`,
            headers,
        })
        const page = await server.inject({
            method: 'GET',
            url: `${url}?after=legacy.1`,
            headers,
        })

        // Assert
        expect(list.statusCode).toBe(200)
        expect(read.statusCode).toBe(200)
        expect(read.json()).toEqual({
            id: 'legacy.1',
            revision: expect.stringMatching(/^[a-f0-9]{64}$/),
            ...(kind === 'talks' ? { speakers: [] } : {}),
        })
        expect(page.statusCode).toBe(200)
    })

    if (kind === 'talks') {
        it.each(['POST', 'PATCH'] as const)(
            'rejects unknown speaker references before writing: %s',
            async (method) => {
                // Arrange
                const snapshot = (
                    await server.inject({
                        method: 'GET',
                        url: recordUrl,
                        headers,
                    })
                ).json()
                const target = method === 'POST' ? url : recordUrl
                const payload = {
                    title: 'New title',
                    speakers: ['missing'],
                    ...(method === 'POST'
                        ? { id: 'new_talk' }
                        : { revision: snapshot.revision }),
                }

                // Act
                const response = await server.inject({
                    method,
                    url: target,
                    headers,
                    payload,
                })
                const stored = (
                    await db
                        .collection('projects')
                        .doc(project.id)
                        .collection('talks')
                        .doc(method === 'POST' ? 'new_talk' : recordId)
                        .get()
                ).data()

                // Assert
                expect(response.statusCode).toBe(400)
                expect(stored?.title).toBe(
                    method === 'POST' ? undefined : original
                )
            }
        )

        it('changes speaker associations without rewriting the title', async () => {
            // Arrange
            const snapshot = (
                await server.inject({ method: 'GET', url: recordUrl, headers })
            ).json()

            // Act
            const response = await server.inject({
                method: 'PATCH',
                url: recordUrl,
                headers,
                payload: { revision: snapshot.revision, speakers: [] },
            })
            const after = (
                await server.inject({ method: 'GET', url: recordUrl, headers })
            ).json()

            // Assert
            expect(response.statusCode).toBe(200)
            expect(after).toMatchObject({ title: original, speakers: [] })
        })
        it('stores the defaults the attendee app groups by', async () => {
            // Act
            const response = await server.inject({
                method: 'POST',
                url,
                headers,
                payload: { id: 'api_talk', title: 'From API' },
            })
            const stored = (
                await db
                    .collection('projects')
                    .doc(project.id)
                    .collection('talks')
                    .doc('api_talk')
                    .get()
            ).data()

            // Assert
            expect(response.statusCode).toBe(201)
            expect(stored).toMatchObject({ trackTitle: '', tags: [] })
        })

        it('keeps references to deleted speakers it already holds', async () => {
            // Arrange
            const ref = db
                .collection('projects')
                .doc(project.id)
                .collection('talks')
                .doc(recordId)
            await ref.update({ speakers: ['deleted_speaker', 'speaker_1'] })
            const snapshot = (
                await server.inject({ method: 'GET', url: recordUrl, headers })
            ).json()

            // Act
            const response = await server.inject({
                method: 'PATCH',
                url: recordUrl,
                headers,
                payload: {
                    revision: snapshot.revision,
                    title: 'Renamed',
                    speakers: snapshot.speakers,
                },
            })

            // Assert
            expect(response.statusCode).toBe(200)
            expect((await ref.get()).data()?.title).toBe('Renamed')
        })

        it('refuses a talk ID that still has votes from a deleted talk', async () => {
            // Arrange
            await db
                .collection('projects')
                .doc(project.id)
                .collection('talks')
                .doc(recordId)
                .delete()

            // Act
            const response = await server.inject({
                method: 'POST',
                url,
                headers,
                payload: { id: recordId, title: 'Different talk' },
            })

            // Assert
            expect(response.statusCode).toBe(409)
        })
    }
})
