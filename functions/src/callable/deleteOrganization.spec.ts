import { beforeEach, describe, expect, it, vi } from 'vitest'
import firebaseFunctionsTest from 'firebase-functions-test'
import { HttpsError } from 'firebase-functions/v2/https'
import { deleteOrganization } from './deleteOrganization'

type Where = [string, string, unknown]

const fake = vi.hoisted(() => ({
    organization: null as null | { ownerUserId: string; name: string },
    projectIds: [] as string[],
    inviteIds: [] as string[],
    queries: [] as { collection: string; where: Where[]; limit?: number }[],
    transactionDeletes: [] as string[],
    recursiveDeletes: [] as string[],
    writerDeletes: [] as string[],
    storagePrefixes: [] as string[],
    deleteFiles: vi.fn(),
}))

vi.mock('../helpers/getOrganization', () => ({
    getOrganization: async (id: string) => {
        if (!fake.organization) {
            throw new HttpsError('not-found', 'Organization has not been found.')
        }
        return { ...fake.organization, id }
    },
}))

vi.mock('firebase-admin', () => {
    const query = (collection: string) => {
        const recorded = { collection, where: [] as Where[] } as {
            collection: string
            where: Where[]
            limit?: number
        }
        fake.queries.push(recorded)
        const ids = () =>
            collection === 'projects' ? fake.projectIds : fake.inviteIds
        const q = {
            where: (field: string, op: string, value: unknown) => {
                recorded.where.push([field, op, value])
                return q
            },
            limit: (limit: number) => {
                recorded.limit = limit
                return q
            },
            get: async () => ({
                empty: ids().length === 0,
                forEach: (callback: (doc: { ref: string }) => void) =>
                    ids().forEach((id) =>
                        callback({ ref: `${collection}/${id}` })
                    ),
            }),
        }
        return q
    }
    const db = {
        collection: (name: string) => ({
            ...query(name),
            doc: (id: string) => `${name}/${id}`,
        }),
        runTransaction: async (
            callback: (transaction: unknown) => Promise<void>
        ) =>
            callback({
                get: (q: { get: () => Promise<unknown> }) => q.get(),
                delete: (ref: string) => fake.transactionDeletes.push(ref),
            }),
        recursiveDelete: async (ref: string) => {
            fake.recursiveDeletes.push(ref)
        },
        bulkWriter: () => ({
            delete: async (ref: string) => {
                fake.writerDeletes.push(ref)
            },
            close: async () => undefined,
        }),
    }
    const storage = {
        bucket: () => ({ deleteFiles: fake.deleteFiles }),
    }
    return { firestore: () => db, storage: () => storage }
})

const callDelete = async (data: unknown, uid: string | null = 'owner') =>
    firebaseFunctionsTest().wrap(deleteOrganization)({
        data,
        auth: uid ? { uid, token: {} } : undefined,
    } as never)

beforeEach(() => {
    fake.organization = { ownerUserId: 'owner', name: 'Org' }
    fake.projectIds = []
    fake.inviteIds = []
    fake.queries = []
    fake.transactionDeletes = []
    fake.recursiveDeletes = []
    fake.writerDeletes = []
    fake.deleteFiles.mockReset().mockImplementation(
        async ({ prefix }: { prefix: string }) => {
            fake.storagePrefixes.push(prefix)
        }
    )
    fake.storagePrefixes = []
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('deleteOrganization', () => {
    it('deletes the organization, its sub-collections, invites and images', async () => {
        fake.inviteIds = ['i1', 'i2']

        await expect(callDelete({ organizationId: 'org1' })).resolves.toBe(
            'Delete successful'
        )

        expect(fake.queries).toContainEqual({
            collection: 'projects',
            where: [['organizationId', '==', 'org1']],
            limit: 1,
        })
        expect(fake.queries).toContainEqual({
            collection: 'invites',
            where: [['organizationId', '==', 'org1']],
        })
        expect(fake.transactionDeletes).toEqual(['organizations/org1'])
        expect(fake.recursiveDeletes).toEqual(['organizations/org1'])
        expect(fake.writerDeletes).toEqual(['invites/i1', 'invites/i2'])
        expect(fake.storagePrefixes.sort()).toEqual([
            'organizations/org1/',
            'uploads/org1/',
        ])
    })

    it('refuses while the organization still has events', async () => {
        fake.projectIds = ['p1']

        await expect(
            callDelete({ organizationId: 'org1' })
        ).rejects.toMatchObject({ code: 'failed-precondition' })
        expect(fake.transactionDeletes).toEqual([])
        expect(fake.recursiveDeletes).toEqual([])
        expect(fake.deleteFiles).not.toHaveBeenCalled()
    })

    it('refuses anyone but the owner', async () => {
        await expect(
            callDelete({ organizationId: 'org1' }, 'admin')
        ).rejects.toMatchObject({ code: 'permission-denied' })
        expect(fake.transactionDeletes).toEqual([])
    })

    it('refuses unauthenticated calls and a missing organizationId', async () => {
        await expect(
            callDelete({ organizationId: 'org1' }, null)
        ).rejects.toMatchObject({ code: 'unauthenticated' })
        await expect(callDelete({})).rejects.toMatchObject({
            code: 'invalid-argument',
        })
    })

    it('reports a missing organization', async () => {
        fake.organization = null

        await expect(
            callDelete({ organizationId: 'org1' })
        ).rejects.toMatchObject({ code: 'not-found' })
    })

    it('still succeeds when a cleanup fails once the organization is deleted', async () => {
        fake.deleteFiles.mockRejectedValue(new Error('storage down'))

        await expect(callDelete({ organizationId: 'org1' })).resolves.toBe(
            'Delete successful'
        )
        expect(fake.transactionDeletes).toEqual(['organizations/org1'])
        expect(console.error).toHaveBeenCalled()
    })
})
