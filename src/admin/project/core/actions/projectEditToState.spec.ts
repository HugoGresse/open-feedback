import { describe, expect, test } from 'vitest'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { projectEditToState } from './projectEditToState'

describe('projectEditToState', () => {
    test('stores null instead of the deleteField() sentinels', () => {
        const state = projectEditToState({
            name: 'Event',
            voteStartTime: firebase.firestore.FieldValue.delete(),
            voteEndTime: firebase.firestore.FieldValue.delete(),
        })

        expect(state).toEqual({
            name: 'Event',
            voteStartTime: null,
            voteEndTime: null,
        })
    })

    test('keeps the other values as they are', () => {
        const chipColors = ['ff0000']
        const state = projectEditToState({
            chipColors,
            voteStartTime: '2026-06-27T16:20:00.000Z',
        })

        expect(state.chipColors).toBe(chipColors)
        expect(state.voteStartTime).toBe('2026-06-27T16:20:00.000Z')
    })
})
