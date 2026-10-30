import { beforeEach, describe, expect, test, vi } from 'vitest'
import { deleteOrganization } from './deleteOrganization'
import {
    DELETE_ORGANIZATION_SUCCESS,
    GET_ORGANIZATIONS_SUCCESS,
} from '../organizationActionTypes'
import { adminOrganizationReducer } from '../organizationReducer'
import type { Organization } from '../../../../core/models'
import type { AppDispatch, RootState } from '../../../../store'

const deleteOrganizationCallable = vi.hoisted(() => vi.fn())

vi.mock('../../../../firebase.ts', () => ({
    functions: { deleteOrganization: deleteOrganizationCallable },
}))
vi.mock('./selectUnselectActions', () => ({
    unselectOrganization: () => ({ type: 'unselectOrganization' }),
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

const notification = (dispatch: ReturnType<typeof vi.fn>) =>
    dispatch.mock.calls
        .map(([action]) => action)
        .find((action) => action.type === 'notification')?.notification

beforeEach(() => {
    deleteOrganizationCallable.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('deleteOrganization', () => {
    test('calls the function, then unselects and removes the organization', async () => {
        deleteOrganizationCallable.mockResolvedValue({})

        const { dispatch, result } = await run()

        expect(result).toBe(true)
        expect(deleteOrganizationCallable).toHaveBeenCalledWith({
            organizationId: 'org1',
        })
        // Unselected first, so the organization page does not render a 404
        const types = dispatch.mock.calls.map(([action]) => action.type)
        expect(types.slice(0, 2)).toEqual([
            'unselectOrganization',
            DELETE_ORGANIZATION_SUCCESS,
        ])
        expect(dispatch).toHaveBeenCalledWith({
            type: DELETE_ORGANIZATION_SUCCESS,
            payload: 'org1',
        })
    })

    test.each([
        ['functions/failed-precondition', 'organization.delete.hasEvents'],
        ['functions/permission-denied', 'organization.delete.permissionDenied'],
    ])('reports a %s error', async (code, i18nkey) => {
        deleteOrganizationCallable.mockRejectedValue({ code })

        const { dispatch, result } = await run()

        expect(result).toBe(false)
        expect(notification(dispatch)).toEqual({ type: 'error', i18nkey })
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: DELETE_ORGANIZATION_SUCCESS })
        )
    })

    test('reports any other error with its message', async () => {
        deleteOrganizationCallable.mockRejectedValue(new Error('internal'))

        const { dispatch, result } = await run()

        expect(result).toBe(false)
        expect(notification(dispatch)).toEqual({
            type: 'error',
            i18nkey: 'organization.delete.fail',
            message: 'Error: internal',
        })
    })
})

describe('adminOrganizationReducer on delete', () => {
    test('removes the deleted organization', () => {
        const org = (id: string) => ({ id, name: id }) as Organization
        let state = adminOrganizationReducer(undefined, {
            type: GET_ORGANIZATIONS_SUCCESS,
            payload: [org('org1'), org('org2')],
        })

        state = adminOrganizationReducer(state, {
            type: DELETE_ORGANIZATION_SUCCESS,
            payload: 'org1',
        })

        expect(state.data.organizations.map((o) => o.id)).toEqual(['org2'])
    })
})
