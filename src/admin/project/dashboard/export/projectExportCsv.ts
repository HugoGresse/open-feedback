// RFC 4180 CSV flavours of the project export, for spreadsheet users: one
// file with a row per talk (vote counts as columns), one with a row per comment.
import type { ExportedVoteItem, ProjectExport } from './projectExport'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../../../core/contants'

export type CsvCell = string | number | null | undefined
export type CsvDelimiter = ',' | ';'

/** Byte order mark, so that Excel reads the file as UTF-8. */
export const CSV_BOM = '\uFEFF'

// Spreadsheets run cells starting with these characters as formulas, and the
// comments are written by anonymous attendees.
const FORMULA_PREFIX = /^[=+\-@\t\r]/
// Both delimiters are quoted whatever the file uses: Excel splits on the list
// separator of the system, so an unquoted `;` would start a new cell (that
// the formula check above never sees) on a French or German Excel.
const NEEDS_QUOTES = /[",;\t\r\n]/

/**
 * Excel opens a CSV file with the list separator of the system, which is `;`
 * where the decimal separator is a comma (fr, de...).
 */
export const getCsvDelimiter = (locale?: string): CsvDelimiter =>
    new Intl.NumberFormat(locale).format(1.5).includes(',') ? ';' : ','

export const escapeCsvCell = (cell: CsvCell): string => {
    if (cell === null || cell === undefined) {
        return ''
    }
    if (typeof cell === 'number') {
        return String(cell)
    }
    // Event data comes from external JSON files too: never trust it is a string.
    const raw = String(cell)
    const text = FORMULA_PREFIX.test(raw) ? `'${raw}` : raw
    return NEEDS_QUOTES.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export const toCsv = (
    header: string[],
    rows: CsvCell[][],
    delimiter: CsvDelimiter = ','
): string =>
    [header, ...rows]
        .map((row) => row.map(escapeCsvCell).join(delimiter))
        .join('\r\n')
        .concat('\r\n')

// Vote item names label columns: a name already used by another column gets
// the vote item id appended, so that every column can be told apart.
const toVoteItemLabels = (
    voteItems: ExportedVoteItem[],
    otherColumns: string[]
): Map<string, string> => {
    const usedLabels = new Set(otherColumns)
    return new Map(
        voteItems.map((item) => {
            const label = usedLabels.has(item.name)
                ? `${item.name} (${item.id})`
                : item.name
            usedLabels.add(label)
            return [item.id, label]
        })
    )
}

const TALK_COLUMNS = [
    'talkId',
    'title',
    'trackTitle',
    'startTime',
    'endTime',
    'tags',
    'speakers',
]
const TALK_TOTAL_COLUMNS = ['voteCount', 'commentCount']

export const talksToCsv = (
    { voteItems, talks }: ProjectExport,
    delimiter: CsvDelimiter = ','
): string => {
    const booleanVoteItems = voteItems.filter(
        (item) => item.type === VOTE_TYPE_BOOLEAN
    )
    const labels = toVoteItemLabels(booleanVoteItems, [
        ...TALK_COLUMNS,
        ...TALK_TOTAL_COLUMNS,
    ])
    const header = [
        ...TALK_COLUMNS,
        ...booleanVoteItems.map((item) => labels.get(item.id) ?? item.id),
        ...TALK_TOTAL_COLUMNS,
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
    return toCsv(header, rows, delimiter)
}

export const commentsToCsv = (
    { voteItems, talks }: ProjectExport,
    delimiter: CsvDelimiter = ','
): string => {
    const labels = toVoteItemLabels(
        voteItems.filter((item) => item.type === VOTE_TYPE_TEXT),
        []
    )
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
            labels.get(comment.voteItemId) ?? comment.voteItemId,
            comment.id,
            comment.text,
            comment.plus,
            comment.createdAt,
            comment.updatedAt,
        ])
    )
    return toCsv(header, rows, delimiter)
}
