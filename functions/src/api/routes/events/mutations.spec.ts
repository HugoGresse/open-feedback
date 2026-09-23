import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FastifyInstance } from 'fastify'
import { FakeFirestore } from 'firestore-vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'

const organization = {
    id: 'org_123',
    name: 'Test Organization',
    ownerUserId: 'owner_123',
    adminUserIds: ['admin_123'],
    editorUserIds: ['editor_123'],
    languages: ['en', 'fr'],
    chipColors: ['123abc'],
    favicon: 'https://example.com/favicon.png',
    logoSmall: 'https://example.com/logo.png',
    disableSoloTalkRedirect: true,
    hideVotesUntilUserVote: true,
    displayFullDates: true,
    voteItems: [
        { id: 'quality', name: 'Quality', type: 'boolean', position: 0 },
    ],
}

const project = {
    id: 'event_123',
    name: 'Existing Event',
    organizationId: organization.id,
    owner: organization.ownerUserId,
    members: [organization.ownerUserId],
    setupType: 'jsonurl',
    config: { jsonUrl: 'https://example.com/schedule.json' },
    languages: ['en'],
    voteItems: organization.voteItems,
    apiKey: 'ofproj_legacy-secret',
    unrelatedSetting: 'preserve me',
    createdAt: '2026-01-01T00:00:00.000Z',
}

describe('event mutations', () => {
    let fastify: FastifyInstance
    let db: FakeFirestore
    let create: ReturnType<typeof vi.fn>
    let commit: ReturnType<typeof vi.fn>
    let deleteFile: ReturnType<typeof vi.fn>
    const orgHeaders = { 'x-api-key': 'oforg_valid' }
    const eventHeaders = { 'x-api-key': 'ofproj_valid' }

    beforeEach(async () => {
        mockFirebaseAdminApp({})
        db = new FakeFirestore(
            { projects: [structuredClone(project)] },
            { mutable: true }
        )
        vi.doMock('firebase-admin/firestore', () => ({
            getFirestore: () => db,
            FieldValue: FakeFirestore.FieldValue,
        }))
        deleteFile = vi.fn().mockResolvedValue([])
        vi.doMock('firebase-admin/storage', () => ({
            getStorage: () => ({
                bucket: () => ({
                    name: 'test-bucket',
                    file: (path: string) => ({
                        delete: (options: unknown) => deleteFile(path, options),
                    }),
                }),
            }),
        }))
        // firestore-vitest does not implement WriteBatch.create. Capture its
        // writes while using the existing fake for document/transaction reads.
        create = vi.fn()
        commit = vi.fn().mockResolvedValue([])
        vi.spyOn(db, 'batch').mockReturnValue({ create, commit } as never)

        const { OrganizationDao } = await import('../../dao/OrganizationDao')
        const { ProjectDao } = await import('../../dao/ProjectDao')
        const { NotFoundError } = await import('../../others/Errors')
        vi.spyOn(
            OrganizationDao,
            'getOrganizationFromApiKey'
        ).mockImplementation(async (_, key) => {
            if (key.apiKey !== orgHeaders['x-api-key']) {
                throw new NotFoundError()
            }
            return organization
        })
        vi.spyOn(ProjectDao, 'getProjectFromApiKey').mockImplementation(
            async (_, key) => {
                if (key.apiKey !== eventHeaders['x-api-key']) {
                    throw new NotFoundError()
                }
                return project
            }
        )
        const { createFastifyAPI } = await import('../../api')
        fastify = await createFastifyAPI()
    })

    afterEach(async () => {
        await fastify?.close()
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    it('creates an event with organization defaults and a private key in one batch', async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: '/events',
            headers: orgHeaders,
            payload: { id: 'my-event', name: 'My Event' },
        })

        expect(response.statusCode).toBe(201)
        const body = response.json()
        expect(body).toMatchObject({
            id: 'my-event',
            name: 'My Event',
            organizationId: organization.id,
            setupType: 'openfeedbackv1',
            languages: organization.languages,
            hideVotesUntilUserVote: true,
            displayFullDates: true,
        })
        expect(body).not.toHaveProperty('owner')
        expect(body).not.toHaveProperty('members')
        expect(body).not.toHaveProperty('apiKey')
        expect(create).toHaveBeenCalledTimes(2)
        const [eventRef, eventData] = create.mock.calls[0]
        expect(eventRef.path).toBe('projects/my-event')
        expect(eventData).toMatchObject({
            owner: organization.ownerUserId,
            members: [organization.ownerUserId],
            organizationId: organization.id,
            voteItems: organization.voteItems,
            chipColors: organization.chipColors,
            favicon: organization.favicon,
            logoSmall: organization.logoSmall,
            disableSoloTalkRedirect: true,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
        })
        expect(eventData).not.toHaveProperty('id')
        expect(eventData).not.toHaveProperty('apiKey')
        const [integrationRef, integrationData] = create.mock.calls[1]
        expect(integrationRef.path).toBe(
            'projects/my-event/private/integration'
        )
        expect(integrationData.apiKey).toMatch(/^ofproj_[a-zA-Z0-9]{48}$/)
        expect(commit).toHaveBeenCalledOnce()
    })

    it('generates an ID and accepts explicit settings for an external schedule', async () => {
        const payload = {
            name: 'External Event',
            setupType: 'jsonurl',
            config: { jsonUrl: 'https://example.com/event.json' },
            languages: ['de'],
            hideVotesUntilUserVote: false,
        }
        const response = await fastify.inject({
            method: 'POST',
            url: '/events/',
            headers: orgHeaders,
            payload,
        })
        expect(response.statusCode).toBe(201)
        expect(response.json()).toMatchObject(payload)
        expect(response.json().id).toMatch(/^[a-zA-Z0-9_-]+$/)
    })

    it('rejects event keys for creation', async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: '/events',
            headers: eventHeaders,
            payload: { name: 'New Event' },
        })
        expect(response.statusCode).toBe(403)
        expect(commit).not.toHaveBeenCalled()
    })

    it('returns 409 when an atomic create encounters an existing ID', async () => {
        commit.mockRejectedValueOnce({ code: 6 })
        const response = await fastify.inject({
            method: 'POST',
            url: '/events',
            headers: orgHeaders,
            payload: { id: 'existing-event', name: 'Duplicate' },
        })
        expect(response.statusCode).toBe(409)
        expect(response.json()).toEqual({
            error: 'Event ID is already in use',
            success: false,
        })
    })

    it('returns a server error for an unrelated storage failure', async () => {
        commit.mockRejectedValueOnce(new Error('Storage unavailable'))
        const response = await fastify.inject({
            method: 'POST',
            url: '/events',
            headers: orgHeaders,
            payload: { name: 'New Event' },
        })
        expect(response.statusCode).toBe(500)
    })

    it.each([
        {},
        { name: '' },
        { name: '   ' },
        { name: 'x'.repeat(101) },
        { name: 'Test', id: 'invalid/id' },
        { name: 'Test', id: '__reserved__' },
        { name: 'Test', setupType: 'unknown' },
        { name: 'Test', setupType: 'jsonurl' },
        {
            name: 'Test',
            setupType: 'hoverboardv2',
            config: { projectId: 'external' },
        },
        { name: 'Test', config: { jsonUrl: 'file:///etc/passwd' } },
        { name: 'Test', voteStartTime: '2026-09-21T10:00:00Z' },
        {
            name: 'Test',
            voteStartTime: '2026-09-21T10:00:00Z',
            voteEndTime: '2026-09-20T10:00:00Z',
        },
    ])('rejects invalid creation data: %j', async (payload) => {
        const response = await fastify.inject({
            method: 'POST',
            url: '/events',
            headers: orgHeaders,
            payload,
        })
        expect(response.statusCode).toBe(400)
        expect(commit).not.toHaveBeenCalled()
    })

    it.each([orgHeaders, eventHeaders])(
        'updates an authorized event while preserving omitted fields (%j)',
        async (headers) => {
            const response = await fastify.inject({
                method: 'PATCH',
                url: `/events/${project.id}`,
                headers,
                payload: {
                    name: 'Renamed Event',
                    hideVotesUntilUserVote: false,
                },
            })
            expect(response.statusCode).toBe(200)
            expect(response.json()).toMatchObject({
                id: project.id,
                name: 'Renamed Event',
                config: project.config,
                organizationId: project.organizationId,
                hideVotesUntilUserVote: false,
            })
            for (const key of [
                'owner',
                'members',
                'apiKey',
                'unrelatedSetting',
            ]) {
                expect(response.json()).not.toHaveProperty(key)
            }
            const stored = (
                await db.collection('projects').doc(project.id).get()
            ).data()
            const { id: _id, ...savedFields } = project
            expect(stored).toMatchObject({
                ...savedFields,
                name: 'Renamed Event',
                hideVotesUntilUserVote: false,
                updatedAt: expect.anything(),
            })
            expect(create).not.toHaveBeenCalled()
        }
    )

    it('replaces supplied config and arrays and exposes changes through GET /events/me', async () => {
        const payload = {
            config: { jsonUrl: 'https://example.com/new.json' },
            languages: ['fr'],
        }
        const updated = await fastify.inject({
            method: 'PATCH',
            url: `/events/${project.id}`,
            headers: eventHeaders,
            payload,
        })
        expect(updated.statusCode).toBe(200)
        expect(updated.json()).toMatchObject(payload)
        const { ProjectDao } = await import('../../dao/ProjectDao')
        vi.mocked(ProjectDao.getProjectFromApiKey).mockResolvedValueOnce({
            ...project,
            ...payload,
        })
        const read = await fastify.inject({
            method: 'GET',
            url: '/events/me',
            headers: eventHeaders,
        })
        expect(read.json()).toMatchObject(payload)
        expect(read.json()).not.toHaveProperty('apiKey')
    })

    it('validates a partial change against the saved voting range and allows clearing it', async () => {
        const ref = db.collection('projects').doc(project.id)
        await ref.update({
            voteStartTime: '2026-09-21T10:00:00Z',
            voteEndTime: '2026-09-21T18:00:00Z',
        })
        const invalid = await fastify.inject({
            method: 'PATCH',
            url: `/events/${project.id}`,
            headers: orgHeaders,
            payload: { voteEndTime: '2026-09-20T18:00:00Z' },
        })
        expect(invalid.statusCode).toBe(400)
        expect((await ref.get()).data()?.voteEndTime).toBe(
            '2026-09-21T18:00:00Z'
        )
        const cleared = await fastify.inject({
            method: 'PATCH',
            url: `/events/${project.id}`,
            headers: orgHeaders,
            payload: { voteStartTime: null, voteEndTime: null },
        })
        expect(cleared.statusCode).toBe(200)
        expect((await ref.get()).data()).toMatchObject({
            voteStartTime: null,
            voteEndTime: null,
        })
    })

    it.each([
        {},
        { name: '' },
        { config: {} },
        { config: { jsonUrl: 'not-a-url' } },
        { config: { unexpected: 'field' } },
        { voteStartTime: 'invalid' },
        { chipColors: [] },
        { chipColors: ['not-a-color'] },
    ])('rejects invalid updates without writing: %j', async (payload) => {
        const response = await fastify.inject({
            method: 'PATCH',
            url: `/events/${project.id}`,
            headers: orgHeaders,
            payload,
        })
        expect(response.statusCode).toBe(400)
        expect(
            (await db.collection('projects').doc(project.id).get()).data()
        ).not.toHaveProperty('updatedAt')
    })

    it.each([
        'owner',
        'members',
        'organizationId',
        'apiKey',
        'createdAt',
        'updatedAt',
        'unknown',
        'config.jsonUrl',
    ])(
        'rejects protected or unknown field %s on both write endpoints',
        async (field) => {
            for (const method of ['POST', 'PATCH'] as const) {
                const response = await fastify.inject({
                    method,
                    url:
                        method === 'POST' ? '/events' : `/events/${project.id}`,
                    headers: orgHeaders,
                    payload: { name: 'Test', [field]: 'untrusted' },
                })
                expect(response.statusCode).toBe(400)
            }
            expect(commit).not.toHaveBeenCalled()
            expect(
                (await db.collection('projects').doc(project.id).get()).data()
            ).not.toHaveProperty('updatedAt')
        }
    )

    it('rejects changes to the event ID', async () => {
        const response = await fastify.inject({
            method: 'PATCH',
            url: `/events/${project.id}`,
            headers: orgHeaders,
            payload: { id: 'replacement' },
        })
        expect(response.statusCode).toBe(400)
    })

    it.each([orgHeaders, eventHeaders])(
        'returns the same 404 for missing and inaccessible events (%j)',
        async (headers) => {
            await db
                .collection('projects')
                .doc('foreign')
                .set({ ...project, organizationId: 'another-org' })
            for (const id of ['foreign', 'missing']) {
                const response = await fastify.inject({
                    method: 'PATCH',
                    url: `/events/${id}`,
                    headers,
                    payload: { name: 'Denied' },
                })
                expect(response.statusCode).toBe(404)
                expect(response.json()).toEqual({
                    error: 'Event not found',
                    success: false,
                })
            }
            expect(
                (await db.collection('projects').doc('foreign').get()).data()
                    ?.name
            ).toBe(project.name)
            expect(
                (await db.collection('projects').doc('missing').get()).exists
            ).toBe(false)
        }
    )

    it('rechecks organization membership at write time', async () => {
        await db
            .collection('projects')
            .doc(project.id)
            .update({ organizationId: 'another-org' })
        const response = await fastify.inject({
            method: 'PATCH',
            url: `/events/${project.id}`,
            headers: orgHeaders,
            payload: { name: 'Denied' },
        })
        expect(response.statusCode).toBe(404)
    })

    it.each(['POST', 'PATCH'] as const)(
        'requires authentication for %s',
        async (method) => {
            for (const headers of [
                {},
                { 'x-api-key': 'oforg_unknown' },
                { 'x-api-key': 'ofproj_unknown' },
            ]) {
                const response = await fastify.inject({
                    method,
                    url:
                        method === 'POST' ? '/events' : `/events/${project.id}`,
                    headers,
                    payload: { name: 'Test' },
                })
                expect(response.statusCode).toBe(401)
            }
            expect(commit).not.toHaveBeenCalled()
        }
    )

    it('allows PATCH in browser CORS preflights', async () => {
        const response = await fastify.inject({
            method: 'OPTIONS',
            url: `/events/${project.id}`,
            headers: {
                origin: 'https://example.com',
                'access-control-request-method': 'PATCH',
                'access-control-request-headers': 'content-type,x-api-key',
            },
        })
        expect(response.statusCode).toBe(204)
        expect(response.headers['access-control-allow-methods']).toContain(
            'PATCH'
        )
    })

    describe('review regressions', () => {
        const patch = (payload: object, headers = orgHeaders) =>
            fastify.inject({
                method: 'PATCH',
                url: `/events/${project.id}`,
                headers,
                payload,
            })
        const eventRef = () => db.collection('projects').doc(project.id)

        it('serializes legacy values the write schema would reject', async () => {
            const { ProjectDao } = await import('../../dao/ProjectDao')
            vi.mocked(ProjectDao.getProjectFromApiKey).mockResolvedValueOnce({
                ...project,
                setupType: 'legacy',
                scheduleLink: 'ftp://example.com/schedule',
                voteStartTime: null,
            } as never)
            const response = await fastify.inject({
                method: 'GET',
                url: '/events/me',
                headers: eventHeaders,
            })
            expect(response.statusCode).toBe(200)
            expect(response.json()).toMatchObject({
                setupType: 'legacy',
                scheduleLink: 'ftp://example.com/schedule',
                voteStartTime: null,
            })
        })

        it('does not answer 500 after committing an update on legacy data', async () => {
            await eventRef().update({ scheduleLink: 'ftp://example.com/s' })
            const response = await patch({ name: 'Committed' })
            expect(response.statusCode).toBe(200)
            expect(response.json().scheduleLink).toBe('ftp://example.com/s')
            expect((await eventRef().get()).data()?.name).toBe('Committed')
        })

        it('normalizes Firestore timestamps in vote windows', async () => {
            const { ProjectDao } = await import('../../dao/ProjectDao')
            const start = new Date('2026-09-21T10:00:00.000Z')
            await eventRef().update({
                voteStartTime: { toDate: () => start },
                voteEndTime: '2026-09-22T10:00:00.000Z',
            })
            const read = await ProjectDao.getProjectFromId(
                {} as never,
                project.id
            )
            expect(read).toMatchObject({
                voteStartTime: start.toISOString(),
            })
            expect(read).not.toHaveProperty('apiKey')
        })

        it('does not re-validate untouched legacy fields', async () => {
            // The admin UI copies the start into the end when only the start
            // is edited, so equal bounds exist in production data.
            await eventRef().update({
                voteStartTime: '2026-09-21T10:00:00.000+02:00',
                voteEndTime: '2026-09-21T10:00:00.000+02:00',
                setupType: 'hoverboardv2',
                config: { projectId: 'p', apiKey: 'k' },
            })
            const renamed = await patch({ name: 'Renamed' })
            expect(renamed.statusCode).toBe(200)
            expect(
                (await patch({ voteEndTime: '2026-09-21T07:00:00.000Z' }))
                    .statusCode
            ).toBe(400)
            expect(
                (await patch({ config: { projectId: 'p', apiKey: 'k' } }))
                    .statusCode
            ).toBe(400)
        })

        it.each(['admin', 'Admin', 'superadmin', 'l', 'LEGAL'])(
            'rejects the reserved or non-canonical event ID %s',
            async (id) => {
                const response = await fastify.inject({
                    method: 'POST',
                    url: '/events',
                    headers: orgHeaders,
                    payload: { id, name: 'Test' },
                })
                expect(response.statusCode).toBe(400)
                expect(commit).not.toHaveBeenCalled()
            }
        )

        it.each(['My-Event', 'my_event', 'ab'])(
            'applies the admin UI ID rules to %s',
            async (id) => {
                const response = await fastify.inject({
                    method: 'POST',
                    url: '/events',
                    headers: orgHeaders,
                    payload: { id, name: 'Test' },
                })
                expect(response.statusCode).toBe(400)
            }
        )

        it.each([
            { name: 12345 },
            { name: 'Test', hideEventName: 'false' },
            { name: 'Test', chipColors: 'aabbcc' },
            { name: 'Test', languages: 'en' },
            { name: 'Test', hideEventName: null },
        ])(
            'rejects wrongly typed values instead of coercing: %j',
            async (payload) => {
                const response = await fastify.inject({
                    method: 'POST',
                    url: '/events',
                    headers: orgHeaders,
                    payload,
                })
                expect(response.statusCode).toBe(400)
                expect(commit).not.toHaveBeenCalled()
            }
        )

        it('returns 400 for Firestore-reserved IDs on PATCH', async () => {
            const response = await fastify.inject({
                method: 'PATCH',
                url: '/events/__reserved__',
                headers: orgHeaders,
                payload: { name: 'Test' },
            })
            expect(response.statusCode).toBe(400)
        })

        it('fills the default voting form when the organization has none', async () => {
            const { OrganizationDao } = await import(
                '../../dao/OrganizationDao'
            )
            vi.mocked(
                OrganizationDao.getOrganizationFromApiKey
            ).mockResolvedValueOnce({ ...organization, voteItems: [] })
            const response = await fastify.inject({
                method: 'POST',
                url: '/events',
                headers: orgHeaders,
                payload: { name: 'No Form' },
            })
            expect(response.statusCode).toBe(201)
            const voteItems = create.mock.calls[0][1].voteItems
            expect(voteItems).toHaveLength(9)
            expect(voteItems[0]).toMatchObject({
                name: 'Fun 😃',
                type: 'boolean',
                position: 0,
            })
            expect(voteItems.at(-1)).toMatchObject({ type: 'text' })
            expect(
                new Set(voteItems.map((i: { id: string }) => i.id)).size
            ).toBe(9)
        })

        it('drops vote item translations of removed languages', async () => {
            await eventRef().update({
                languages: ['en', 'fr'],
                voteItems: [
                    {
                        id: 'a',
                        name: 'Fun',
                        languages: { en: 'Fun', fr: 'Drôle' },
                    },
                    { id: 'b', name: 'Clear', languages: { fr: 'Clair' } },
                    { id: 'c', name: 'Plain' },
                ],
            })
            const response = await patch({ languages: ['en'] })
            expect(response.statusCode).toBe(200)
            expect((await eventRef().get()).data()?.voteItems).toEqual([
                { id: 'a', name: 'Fun', languages: { en: 'Fun' } },
                { id: 'b', name: 'Clear' },
                { id: 'c', name: 'Plain' },
            ])
        })

        describe('replaced images', () => {
            const url = (path: string) =>
                `https://storage.googleapis.com/test-bucket/${path}`

            beforeEach(async () => {
                await eventRef().update({
                    favicon: url(`projects/${project.id}/old_favicon.png`),
                    logoSmall: url('organizations/org_123/logo.png'),
                })
            })

            it('deletes the replaced event favicon after the update', async () => {
                const response = await patch({
                    favicon: url(`projects/${project.id}/new_favicon.png`),
                })
                expect(response.statusCode).toBe(200)
                expect(deleteFile).toHaveBeenCalledOnce()
                expect(deleteFile).toHaveBeenCalledWith(
                    `projects/${project.id}/old_favicon.png`,
                    { ignoreNotFound: true }
                )
            })

            it('never deletes an inherited organization image', async () => {
                const response = await patch({
                    logoSmall: url(`projects/${project.id}/new_logo.png`),
                })
                expect(response.statusCode).toBe(200)
                expect(deleteFile).not.toHaveBeenCalled()
            })

            it('keeps images when the update is rejected', async () => {
                const response = await patch({
                    favicon: url(`projects/${project.id}/new.png`),
                    voteStartTime: '2026-09-21T10:00:00Z',
                })
                expect(response.statusCode).toBe(400)
                expect(deleteFile).not.toHaveBeenCalled()
            })

            it('still succeeds when the storage delete fails', async () => {
                deleteFile.mockRejectedValueOnce(new Error('Storage down'))
                const response = await patch({
                    favicon: url(`projects/${project.id}/new.png`),
                })
                expect(response.statusCode).toBe(200)
                expect((await eventRef().get()).data()?.favicon).toBe(
                    url(`projects/${project.id}/new.png`)
                )
            })
        })
    })
})
