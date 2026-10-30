import { describe, it, expect } from 'vitest'
import {
    commentsToCsv,
    escapeCsvCell,
    getCsvDelimiter,
    talksToCsv,
    toCsv,
} from './projectExportCsv'
import type { ProjectExport } from './projectExport'

describe('escapeCsvCell', () => {
    it('writes empty cells for missing values', () => {
        expect(escapeCsvCell(null)).toBe('')
        expect(escapeCsvCell(undefined)).toBe('')
    })

    it('keeps numbers and plain text as is', () => {
        expect(escapeCsvCell(-3)).toBe('-3')
        expect(escapeCsvCell('Great talk')).toBe('Great talk')
    })

    it('quotes cells with commas, quotes or new lines', () => {
        expect(escapeCsvCell('a, b')).toBe('"a, b"')
        expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""')
        expect(escapeCsvCell('line 1\nline 2')).toBe('"line 1\nline 2"')
        expect(escapeCsvCell('line 1\r\nline 2')).toBe('"line 1\r\nline 2"')
    })

    it('quotes both delimiters and tabs, whatever the file uses', () => {
        expect(escapeCsvCell('a; b')).toBe('"a; b"')
        expect(escapeCsvCell('a\tb')).toBe('"a\tb"')
    })

    it('keeps a formula hidden after a semicolon in a single cell', () => {
        expect(escapeCsvCell('ok;=1+1;x')).toBe('"ok;=1+1;x"')
    })

    it('writes values that are not strings as text', () => {
        expect(escapeCsvCell(['a', 'b'] as never)).toBe('"a,b"')
    })

    it('neutralises text that a spreadsheet would run as a formula', () => {
        expect(escapeCsvCell('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"')
        expect(escapeCsvCell('+1')).toBe("'+1")
        expect(escapeCsvCell('-1 boring')).toBe("'-1 boring")
        expect(escapeCsvCell('@SUM(A1)')).toBe("'@SUM(A1)")
    })
})

describe('toCsv', () => {
    it('joins rows with CRLF and ends with a line break', () => {
        expect(toCsv(['a', 'b'], [[1, 'x,y']])).toBe('a,b\r\n1,"x,y"\r\n')
    })

    it('joins cells with the given delimiter', () => {
        expect(toCsv(['a', 'b'], [[1, 'x;y']], ';')).toBe('a;b\r\n1;"x;y"\r\n')
    })

    it('writes only the header when there is no row', () => {
        expect(toCsv(['a'], [])).toBe('a\r\n')
    })
})

describe('getCsvDelimiter', () => {
    it('uses a semicolon where the decimal separator is a comma', () => {
        expect(getCsvDelimiter('fr-FR')).toBe(';')
        expect(getCsvDelimiter('de-DE')).toBe(';')
    })

    it('uses a comma elsewhere', () => {
        expect(getCsvDelimiter('en-US')).toBe(',')
    })
})

const projectExport: ProjectExport = {
    project: { id: 'p1', name: 'DevFest', exportedAt: '2026-10-11T08:00Z' },
    voteItems: [
        { id: 'fun', name: 'Fun', type: 'boolean' },
        { id: 'clear', name: 'Clear, concise', type: 'boolean' },
        { id: 'comment', name: 'Comment', type: 'text' },
    ],
    talks: [
        {
            id: 't1',
            title: 'Talk "one"',
            trackTitle: 'Room A',
            tags: ['web', 'ai'],
            startTime: '2026-10-10T10:00:00Z',
            endTime: null,
            speakers: ['Ada', 'Grace'],
            voteCount: 5,
            commentCount: 1,
            votes: [
                { voteItemId: 'fun', name: 'Fun', count: 3 },
                { voteItemId: 'clear', name: 'Clear, concise', count: 2 },
            ],
            comments: [
                {
                    id: 'c1',
                    voteItemId: 'comment',
                    text: 'Loved it,\nthanks!',
                    plus: 2,
                    createdAt: '2026-10-10T11:00:00.000Z',
                    updatedAt: null,
                },
            ],
        },
    ],
}

describe('talksToCsv', () => {
    it('writes one row per talk with a column per boolean vote item', () => {
        expect(talksToCsv(projectExport).split('\r\n')).toEqual([
            'talkId,title,trackTitle,startTime,endTime,tags,speakers,Fun,"Clear, concise",voteCount,commentCount',
            't1,"Talk ""one""",Room A,2026-10-10T10:00:00Z,,"web, ai","Ada, Grace",3,2,5,1',
            '',
        ])
    })
})

describe('commentsToCsv', () => {
    it('writes one row per comment, keeping multi-line text in one cell', () => {
        expect(commentsToCsv(projectExport)).toBe(
            'talkId,talkTitle,voteItem,commentId,text,plus,createdAt,updatedAt\r\n' +
                't1,"Talk ""one""",Comment,c1,"Loved it,\nthanks!",2,2026-10-10T11:00:00.000Z,\r\n'
        )
    })
})

describe('vote item columns', () => {
    const withItems = (
        voteItems: ProjectExport['voteItems']
    ): ProjectExport => ({ ...projectExport, voteItems, talks: [] })

    it('tells apart vote items sharing a name or a fixed column name', () => {
        const [header] = talksToCsv(
            withItems([
                { id: 'a', name: 'Fun', type: 'boolean' },
                { id: 'b', name: 'Fun', type: 'boolean' },
                { id: 'c', name: 'voteCount', type: 'boolean' },
            ])
        ).split('\r\n')
        expect(header).toBe(
            'talkId,title,trackTitle,startTime,endTime,tags,speakers,Fun,Fun (b),voteCount (c),voteCount,commentCount'
        )
    })
})
