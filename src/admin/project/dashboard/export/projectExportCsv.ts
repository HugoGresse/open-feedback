// RFC 4180 CSV flavours of the project export, for spreadsheet users: one
// file with a row per talk (vote counts as columns), one with a row per comment.
import type { ProjectExport } from './projectExport'
import { VOTE_TYPE_BOOLEAN } from '../../../../core/contants'

export type CsvCell = string | number | null | undefined

/** Byte order mark, so that Excel reads the file as UTF-8. */
export const CSV_BOM = '\uFEFF'

// Spreadsheets run cells starting with these characters as formulas, and the
// comments are written by anonymous attendees.
const FORMULA_PREFIX = /^[=+\-@\t\r]/
const NEEDS_QUOTES = /[",\r\n]/

export const escapeCsvCell = (cell: CsvCell): string => {
    if (cell === null || cell === undefined) {
        return ''
    }
    if (typeof cell === 'number') {
        return String(cell)
    }
    const text = FORMULA_PREFIX.test(cell) ? `'${cell}` : cell
    return NEEDS_QUOTES.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export const toCsv = (header: string[], rows: CsvCell[][]): string =>
    [header, ...rows]
        .map((row) => row.map(escapeCsvCell).join(','))
        .join('\r\n')
        .concat('\r\n')

export const talksToCsv = ({ voteItems, talks }: ProjectExport): string => {
    const booleanVoteItems = voteItems.filter(
        (item) => item.type === VOTE_TYPE_BOOLEAN
    )
    const header = [
        'talkId',
        'title',
        'trackTitle',
        'startTime',
        'endTime',
        'tags',
        'speakers',
        ...booleanVoteItems.map((item) => item.name),
        'voteCount',
        'commentCount',
    ]
    const rows = talks.map((talk) => {
        const counts = new Map(
            talk.votes.map((vote) => [vote.voteItemId, vote.count])
        )
        return [
            talk.id,
            talk.title,
            talk.trackTitle,
            talk.startTime,
            talk.endTime,
            talk.tags.join(', '),
            talk.speakers.join(', '),
            ...booleanVoteItems.map((item) => counts.get(item.id) ?? 0),
            talk.voteCount,
            talk.commentCount,
        ]
    })
    return toCsv(header, rows)
}

export const commentsToCsv = ({ voteItems, talks }: ProjectExport): string => {
    const voteItemNames = new Map(voteItems.map((item) => [item.id, item.name]))
    const header = [
        'talkId',
        'talkTitle',
        'voteItem',
        'commentId',
        'text',
        'plus',
        'createdAt',
        'updatedAt',
    ]
    const rows = talks.flatMap((talk) =>
        talk.comments.map((comment) => [
            talk.id,
            talk.title,
            voteItemNames.get(comment.voteItemId) ?? comment.voteItemId,
            comment.id,
            comment.text,
            comment.plus,
            comment.createdAt,
            comment.updatedAt,
        ])
    )
    return toCsv(header, rows)
}
