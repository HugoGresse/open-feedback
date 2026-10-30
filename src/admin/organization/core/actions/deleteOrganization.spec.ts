import { beforeEach, describe, expect, test, vi } from 'vitest'
import { deleteOrganization } from './deleteOrganization'
import {
    DELETE_ORGANIZATION_SUCCESS,
    GET_ORGANIZATIONS_SUCCESS,
    SELECT_ORGANIZATION,
} from '../organizationActionTypes'
import { adminOrganizationReducer } from '../organizationReducer'
import type { Organization } from '../../../../core/models'
import type { AppDispatch, RootState } from '../../../../store'

type FakeDoc = { ref: string }
type FakeSnapshot = {
    empty: boolean
    forEach: (callback: (doc: FakeDoc) => void) => void
}

const snapshot = (refs: string[]): FakeSnapshot => ({
    empty: refs.length === 0,
    forEach: (callback) => refs.forEach((ref) => callback({ ref })),
})

const firestore = vi.hoisted(() => ({
    projects: [] as string[],
    privateDocs: [] as string[],
    invites: [] as string[],
    commit: vi.fn(),
    deleted: [] as string[],
}))

vi.mock('../../../../firebase.ts', () => {
    const query = (getRefs: () => string[]) => {
        const q = {
            where: () => q,
            limit: () => q,
            get: () => Promise.resolve(snapshot(getRefs())),
        }
        return q
    }
    return {
        fireStoreMainInstance: {
            collection: (name: string) => {
                if (name === 'projects') return query(() => firestore.projects)
                if (name === 'invites') return query(() => firestore.invites)
                return {
                    doc: (id: string) => ({
                        id: `organizations/${id}`,
                        collection: () => query(() => firestore.privateDocs),
                    }),
                }
            },
            batch: () => ({
                delete: (ref: string | { id: string }) =>
                    firestore.deleted.push(
                        typeof ref === 'string' ? ref : ref.id
                    ),
                commit: firestore.commit,
            }),
        },
    }
})
vi.mock('./updateOrganizationApiKey', () => ({
    ORGANIZATION_PRIVATE_COLLECTION: 'private',
}))
vi.mock('../../../notification/notifcationActions', () => ({
    addNotification: (notification: unknown) => ({
        type: 'notification',
        notification,
    }),
}))

const run = async () => {
    const dispatch = vi.fn()
    const getState = () => ({}) as RootState
    const result = await deleteOrganization('org1')(
        dispatch as unknown as AppDispatch,
        getState,
        undefined
    )
    return { dispatch, result }
}

beforeEach(() => {
    firestore.projects = []
    firestore.privateDocs = []
    firestore.invites = []
    firestore.deleted = []
    firestore.commit.mockReset().mockResolvedValue(undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('deleteOrganization', () => {
    test('deletes the organization, its private docs and invites in one batch', async () => {
        firestore.privateDocs = ['private/integration']
        firestore.invites = ['invites/i1', 'invites/i2']

        const { dispatch, result } = await run()

        expect(result).toBe(true)
        expect(firestore.commit).toHaveBeenCalledTimes(1)
        expect(firestore.deleted).toEqual([
            'private/integration',
            'invites/i1',
            'invites/i2',
            'organizations/org1',
        ])
        expect(dispatch).toHaveBeenCalledWith({
            type: DELETE_ORGANIZATION_SUCCESS,
            payload: 'org1',
        })
    })

    test('refuses to delete an organization which still has events', async () => {
        firestore.projects = ['projects/p1']

        const { dispatch, result } = await run()

        expect(result).toBe(false)
        expect(firestore.commit).not.toHaveBeenCalled()
        expect(dispatch).toHaveBeenCalledWith({
            type: 'notification',
            notification: {
                type: 'error',
                i18nkey: 'organization.delete.hasEvents',
            },
        })
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: DELETE_ORGANIZATION_SUCCESS })
        )
    })

    test('reports a failed deletion and keeps the organization', async () => {
        firestore.commit.mockRejectedValue(new Error('permission-denied'))

        const { dispatch, result } = await run()

        expect(result).toBe(false)
        expect(dispatch).toHaveBeenCalledWith({
            type: 'notification',
            notification: {
                type: 'error',
                i18nkey: 'organization.delete.fail',
                message: 'Error: permission-denied',
            },
        })
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: DELETE_ORGANIZATION_SUCCESS })
        )
    })
})

describe('adminOrganizationReducer on delete', () => {
    const org = (id: string) => ({ id, name: id }) as Organization

    test('removes the organization and unselects it', () => {
        let state = adminOrganizationReducer(undefined, {
            type: GET_ORGANIZATIONS_SUCCESS,
            payload: [org('org1'), org('org2')],
        })
        state = adminOrganizationReducer(state, {
            type: SELECT_ORGANIZATION,
            payload: 'org1',
        })

        state = adminOrganizationReducer(state, {
            type: DELETE_ORGANIZATION_SUCCESS,
            payload: 'org1',
        })

        expect(state.data.organizations.map((o) => o.id)).toEqual(['org2'])
        expect(state.selectedOrganizationId).toBeNull()
    })

    test('keeps another selected organization selected', () => {
        let state = adminOrganizationReducer(undefined, {
            type: SELECT_ORGANIZATION,
            payload: 'org2',
        })

        state = adminOrganizationReducer(state, {
            type: DELETE_ORGANIZATION_SUCCESS,
            payload: 'org1',
        })

        expect(state.selectedOrganizationId).toBe('org2')
    })
})
