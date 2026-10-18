import { beforeEach, describe, expect, test, vi } from 'vitest'
import { deleteProject } from './deleteProject'
import {
    DELETE_PROJECT_SUCCESS,
    GET_PROJECTS_SUCCESS,
} from '../projectActionTypes'
import { projectReducer } from '../projectReducer'
import type { AdminProject } from '../projectActionTypes'
import type { TFunction } from 'react-i18next'
import type { AppDispatch, RootState } from '../../../../store'

const deleteProjectCallable = vi.hoisted(() => vi.fn())

vi.mock('../../../../firebase.ts', () => ({
    functions: { deleteProject: deleteProjectCallable },
}))
vi.mock('../../../notification/notifcationActions', () => ({
    addNotification: (notification: unknown) => ({
        type: 'notification',
        notification,
    }),
}))

const t = ((key: string) => key) as TFunction

const run = async () => {
    const dispatch = vi.fn()
    const getState = () => ({}) as RootState
    const result = deleteProject('p1', t)(
        dispatch as unknown as AppDispatch,
        getState,
        undefined
    )
    await result.catch(() => undefined)
    return dispatch
}

beforeEach(() => {
    deleteProjectCallable.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('deleteProject', () => {
    test('removes the deleted project from the store', async () => {
        deleteProjectCallable.mockResolvedValue({})

        const dispatch = await run()

        expect(dispatch).toHaveBeenCalledWith({
            type: DELETE_PROJECT_SUCCESS,
            payload: 'p1',
        })
    })

    test('reports a permission denied callable error', async () => {
        deleteProjectCallable.mockRejectedValue({
            code: 'functions/permission-denied',
        })

        const dispatch = await run()

        expect(dispatch).toHaveBeenCalledWith({
            type: 'notification',
            notification: {
                type: 'error',
                message: 'settingsSetup.deleteEvent.errors.permissionDenied',
            },
        })
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: DELETE_PROJECT_SUCCESS })
        )
    })
})

describe('projectReducer DELETE_PROJECT_SUCCESS', () => {
    test('removes the project from the projects list', () => {
        const project = (id: string) => ({ id }) as AdminProject
        const initialState = projectReducer(undefined, {
            type: GET_PROJECTS_SUCCESS,
            payload: [project('p1'), project('p2')],
        })

        const state = projectReducer(initialState, {
            type: DELETE_PROJECT_SUCCESS,
            payload: 'p1',
        })

        expect(state.data.projects.map((p) => p.id)).toEqual(['p2'])
    })
})
