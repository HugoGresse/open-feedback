import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'
import { mockWhere } from 'firestore-vitest/mocks/firestore'

// Event (project) doc as stored in Firestore, with the public-data URL and the
// vote items + a seeded sessionVotes subcollection.
const seededProject = {
    id: 'proj_123',
    name: 'Test Event',
    owner: 'user_123',
    members: ['user_123'],
    organizationId: 'org_123',
    config: { jsonUrl: 'https://data.example.test/openfeedback.json' },
    voteItems: [
        { id: 'q1', name: 'Quality' },
        { id: 'q2', name: 'Score' },
    ],
    _collections: {
        sessionVotes: [
            {
                id: 'session1',
                // uidB has no `plus` — must default to 0, not "(undefined)".
                q1: {
                    uidA: { text: 'Great talk', plus: 2 },
                    uidB: { text: 'Loved it' },
                },
                // Count-type vote: a numeric tally, must stay a number.
                q2: 22,
            },
        ],
    },
}

// The event's public sessions/speakers JSON (fetched from config.jsonUrl).
const openFeedbackJson = {
    sessions: {
        session1: {
            title: 'Talk 1',
            speakers: ['spk1'],
            tags: ['frontend'],
            trackTitle: 'Track A',
        },
    },
    speakers: { spk1: { name: 'Alice' } },
}

const stubFetch = (json: unknown = openFeedbackJson, ok = true, status = 200) =>
    vi.stubGlobal(
        'fetch',
        vi.fn(async () => ({ ok, status, json: async () => json }))
    )

// Stub the private-subcollection key resolution used by authenticateRequest:
// collectionGroup('private').where(...).limit(1).get(), grandparent = entity.
const mockKeyResolves = (
    parentCollection: string,
    doc: Record<string, unknown>
) => {
    const entityDoc = { exists: true, id: doc.id as string, data: () => doc }
    const entityRef = {
        id: doc.id as string,
        parent: { id: parentCollection },
        get: () => entityDoc,
    }
    const integrationDoc = {
        ref: {
            id: 'integration',
            parent: { parent: entityRef },
            set: () => Promise.resolve(),
        },
    }
    mockWhere.mockImplementation(() => ({
        limit: () => ({
            get: () => ({ empty: false, docs: [integrationDoc] }),
        }),
    }))
}

const mockProjectKey = (project = seededProject) =>
    mockKeyResolves('projects', project)
const mockOrgKey = (org: Record<string, unknown> = { id: 'org_123' }) =>
    mockKeyResolves('organizations', org)

const expectedRow = {
    sessionId: 'session1',
    title: 'Talk 1',
    speakers: 'spk1',
    speakersName: 'Alice',
    tags: 'frontend',
    trackTitle: 'Track A',
    Quality: 'Great talk (2), Loved it (0)',
    Score: 22,
}

describe('/events/:projectId/votes', () => {
    let fastify: any

    beforeEach(async () => {
        mockFirebaseAdminApp({ projects: [seededProject] })
        stubFetch()
        const { createFastifyAPI } = await import('../../api')
        fastify = await createFastifyAPI()
    })

    afterEach(async () => {
        if (fastify) {
            await fastify.close()
        }
        vi.unstubAllGlobals()
        vi.clearAllMocks()
    })

    it('returns 401 when no API key is provided', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
        })
        expect(response.statusCode).toBe(401)
    })

    it('exports votes for the event matching a project key', async () => {
        mockProjectKey()

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
            headers: { 'x-api-key': 'ofproj_test-key' },
        })

        expect(response.statusCode).toBe(200)
        const body = JSON.parse(response.body)
        expect(body.projectId).toBe('proj_123')
        expect(body.sessionsCount).toBe(1)
        expect(body.sessions[0]).toEqual(expectedRow)
        // Count-type votes serialize as JSON numbers, not strings.
        expect(typeof body.sessions[0].Score).toBe('number')
        expect(typeof body.sessions[0].Quality).toBe('string')
    })

    it('rejects a project key for a different event with 404', async () => {
        mockProjectKey({ ...seededProject, id: 'proj_other' })

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
            headers: { 'x-api-key': 'ofproj_test-key' },
        })

        expect(response.statusCode).toBe(404)
    })

    it('exports votes for an event in the organization (org key)', async () => {
        mockOrgKey({ id: 'org_123' })

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
            headers: { 'x-api-key': 'oforg_test-key' },
        })

        expect(response.statusCode).toBe(200)
        const body = JSON.parse(response.body)
        expect(body.sessionsCount).toBe(1)
        expect(body.sessions[0]).toEqual(expectedRow)
    })

    it('rejects an org key for an event in another organization with 404', async () => {
        mockOrgKey({ id: 'org_999' })

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
            headers: { 'x-api-key': 'oforg_test-key' },
        })

        expect(response.statusCode).toBe(404)
        expect(JSON.parse(response.body).error).toBe('Event not found')
    })

    it('returns the same 404 for a non-existent event (not enumerable)', async () => {
        mockOrgKey({ id: 'org_123' })

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_missing/votes',
            headers: { 'x-api-key': 'oforg_test-key' },
        })

        expect(response.statusCode).toBe(404)
        // Identical message to the wrong-org case above: ids stay opaque.
        expect(JSON.parse(response.body).error).toBe('Event not found')
    })

    it('returns 400 when the public data URL responds with an error', async () => {
        stubFetch(openFeedbackJson, false, 502)
        mockProjectKey()

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
            headers: { 'x-api-key': 'ofproj_test-key' },
        })

        expect(response.statusCode).toBe(400)
    })

    it('returns 400 when the event has no public data URL', async () => {
        const { config: _omit, ...noUrlProject } = seededProject
        mockProjectKey(noUrlProject as typeof seededProject)

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/proj_123/votes',
            headers: { 'x-api-key': 'ofproj_test-key' },
        })

        expect(response.statusCode).toBe(400)
    })
})
