import { describe, it, expect } from 'vitest'
import {
    buildProjectExport,
    type ProjectExportInput,
    toExportFileName,
    toExportedVoteItems,
} from './projectExport'
import type { Timestamp, VoteItem } from '../../../../core/models'

const timestamp = (iso: string) =>
    ({ toDate: () => new Date(iso) }) as Timestamp

const voteItems: VoteItem[] = [
    { id: 'title', type: 'title', name: 'Feedback' },
    { id: 'fun', type: 'boolean', name: 'Fun' },
    { id: 'sep', type: 'separator', name: null },
    { id: 'clear', type: 'boolean', name: 'Clear' },
    { id: 'comment', type: 'text', name: 'Comment' },
]

const input = (
    overrides: Partial<ProjectExportInput> = {}
): ProjectExportInput => ({
    project: { id: 'p1', name: 'DevFest' },
    voteItems,
    talks: [
        {
            id: 't1',
            title: 'Talk one',
            trackTitle: 'Room A',
            tags: ['web'],
            startTime: '2026-10-10T10:00:00Z',
            endTime: '2026-10-10T10:45:00Z',
            speakers: ['s1', 'unknown'],
        },
        { id: 't2', title: 'Talk two' },
    ],
    speakers: { s1: { id: 's1', name: 'Ada' } },
    talkVotes: {
        t1: {
            votes: {
                fun: 3,
                clear: -1,
                comment: {
                    c1: {
                        text: 'nice',
                        plus: 1,
                        createdAt: timestamp('2026-10-10T11:00:00Z'),
                    },
                    c2: { text: 'great, really', plus: 4 },
                    deleted: {},
                },
            },
        },
    },
    exportedAt: new Date('2026-10-11T08:00:00Z'),
    ...overrides,
})

describe('toExportedVoteItems', () => {
    it('keeps the boolean and text items in the form order', () => {
        expect(toExportedVoteItems(voteItems)).toEqual([
            { id: 'fun', name: 'Fun', type: 'boolean' },
            { id: 'clear', name: 'Clear', type: 'boolean' },
            { id: 'comment', name: 'Comment', type: 'text' },
        ])
    })

    it('falls back to the id when an item has no name', () => {
        expect(
            toExportedVoteItems([{ id: 'x', type: 'boolean', name: null }])
        ).toEqual([{ id: 'x', name: 'x', type: 'boolean' }])
    })
})

describe('buildProjectExport', () => {
    it('describes the project and the export date', () => {
        expect(buildProjectExport(input()).project).toEqual({
            id: 'p1',
            name: 'DevFest',
            exportedAt: '2026-10-11T08:00:00.000Z',
        })
    })

    it('joins a talk with its speakers, votes and comments', () => {
        const [talk] = buildProjectExport(input()).talks
        expect(talk).toEqual({
            id: 't1',
            title: 'Talk one',
            trackTitle: 'Room A',
            tags: ['web'],
            startTime: '2026-10-10T10:00:00Z',
            endTime: '2026-10-10T10:45:00Z',
            speakers: ['Ada', 'unknown'],
            voteCount: 3,
            commentCount: 2,
            votes: [
                { voteItemId: 'fun', name: 'Fun', count: 3 },
                { voteItemId: 'clear', name: 'Clear', count: 0 },
            ],
            comments: [
                {
                    id: 'c2',
                    voteItemId: 'comment',
                    text: 'great, really',
                    plus: 4,
                    createdAt: null,
                    updatedAt: null,
                },
                {
                    id: 'c1',
                    voteItemId: 'comment',
                    text: 'nice',
                    plus: 1,
                    createdAt: '2026-10-10T11:00:00.000Z',
                    updatedAt: null,
                },
            ],
        })
    })

    it('exports talks without votes with zero counts', () => {
        const [, talk] = buildProjectExport(input()).talks
        expect(talk).toMatchObject({
            id: 't2',
            trackTitle: null,
            tags: [],
            startTime: null,
            speakers: [],
            voteCount: 0,
            commentCount: 0,
            comments: [],
        })
        expect(talk.votes.map((vote) => vote.count)).toEqual([0, 0])
    })

    it('ignores votes of items no longer in the voting form', () => {
        const [talk] = buildProjectExport(
            input({ talkVotes: { t1: { votes: { removed: 9, fun: 1 } } } })
        ).talks
        expect(talk.voteCount).toBe(1)
    })
})

describe('toExportFileName', () => {
    it('replaces spaces and forbidden characters', () => {
        expect(toExportFileName(' DevFest: Nantes/2026 ', 'votes', 'csv')).toBe(
            'DevFest-Nantes-2026-openfeedback-votes.csv'
        )
    })

    it('keeps accented letters', () => {
        expect(toExportFileName('Café Conf', 'data', 'json')).toBe(
            'Café-Conf-openfeedback-data.json'
        )
    })

    it('falls back when nothing is left of the name', () => {
        expect(toExportFileName(' / ', 'data', 'json')).toBe(
            'event-openfeedback-data.json'
        )
    })
})
