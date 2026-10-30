// Builds the data export of a project (talks, votes and comments) from what
// the dashboard already loaded: no Firestore access, so it stays pure and
// testable. The CSV flavours are built from this structure in projectExportCsv.
import type {
    AggregatedTalkVotes,
    AggregatedTextVote,
    Speaker,
    SpeakersMap,
    Talk,
    Timestamp,
    VoteItem,
} from '../../../../core/models'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../../../core/contants'

export interface ExportedVoteItem {
    id: string
    name: string
    type: typeof VOTE_TYPE_BOOLEAN | typeof VOTE_TYPE_TEXT
}

export interface ExportedVoteCount {
    voteItemId: string
    name: string
    count: number
}

export interface ExportedComment {
    id: string
    voteItemId: string
    text: string
    /** Number of up-votes, the author's own vote included. */
    plus: number
    /** ISO 8601 date-time. */
    createdAt: string | null
    /** ISO 8601 date-time. */
    updatedAt: string | null
}

export interface ExportedTalk {
    id: string
    title: string
    trackTitle: string | null
    tags: string[]
    /** ISO 8601 date-time. */
    startTime: string | null
    /** ISO 8601 date-time. */
    endTime: string | null
    /** Speaker names, the speaker id when the speaker is unknown. */
    speakers: string[]
    /** Sum of the boolean votes, comments excluded. */
    voteCount: number
    commentCount: number
    /** One entry per boolean vote item, in the voting form order. */
    votes: ExportedVoteCount[]
    /** Most up-voted first. */
    comments: ExportedComment[]
}

export interface ProjectExport {
    project: {
        id: string
        name: string
        /** ISO 8601 date-time. */
        exportedAt: string
    }
    voteItems: ExportedVoteItem[]
    talks: ExportedTalk[]
}

export interface ProjectExportInput {
    project: { id: string; name: string }
    /** The voting form, titles and separators are skipped. */
    voteItems: VoteItem[]
    talks: Talk[]
    speakers: SpeakersMap
    /** `sessionVotes` documents keyed by talk id. */
    talkVotes: Record<string, { votes: AggregatedTalkVotes } | undefined>
    exportedAt: Date
}

const toIsoDate = (date?: Timestamp | null): string | null =>
    date ? date.toDate().toISOString() : null

const isExportedVoteItemType = (
    type: VoteItem['type']
): type is ExportedVoteItem['type'] =>
    type === VOTE_TYPE_BOOLEAN || type === VOTE_TYPE_TEXT

export const toExportedVoteItems = (
    voteItems: VoteItem[]
): ExportedVoteItem[] =>
    voteItems.flatMap((item) =>
        isExportedVoteItemType(item.type)
            ? [{ id: item.id, name: item.name ?? item.id, type: item.type }]
            : []
    )

// Deleted text votes stay in the aggregation as empty objects.
const toComments = (
    voteItemId: string,
    value: AggregatedTalkVotes[string] | undefined
): ExportedComment[] => {
    if (!value || typeof value !== 'object') {
        return []
    }
    return Object.entries(value).flatMap(
        ([id, vote]: [string, AggregatedTextVote]) =>
            vote?.text
                ? [
                      {
                          id,
                          voteItemId,
                          text: vote.text,
                          plus: vote.plus ?? 1,
                          createdAt: toIsoDate(vote.createdAt),
                          updatedAt: toIsoDate(vote.updatedAt),
                      },
                  ]
                : []
    )
}

const toSpeakerNames = (
    speakerIds: string[] | undefined,
    speakers: SpeakersMap
): string[] =>
    (speakerIds ?? []).map(
        (speakerId) =>
            (speakers[speakerId] as Speaker | undefined)?.name ?? speakerId
    )

const toExportedTalk = (
    talk: Talk,
    voteItems: ExportedVoteItem[],
    speakers: SpeakersMap,
    talkVotes: AggregatedTalkVotes | undefined
): ExportedTalk => {
    const votes = voteItems
        .filter((item) => item.type === VOTE_TYPE_BOOLEAN)
        .map((item) => {
            const value = talkVotes?.[item.id]
            return {
                voteItemId: item.id,
                name: item.name,
                count: typeof value === 'number' ? Math.max(value, 0) : 0,
            }
        })
    const comments = voteItems
        .filter((item) => item.type === VOTE_TYPE_TEXT)
        .flatMap((item) => toComments(item.id, talkVotes?.[item.id]))
        .sort((a, b) => b.plus - a.plus)

    return {
        id: talk.id,
        title: talk.title,
        trackTitle: talk.trackTitle ?? null,
        tags: talk.tags ?? [],
        startTime: talk.startTime ?? null,
        endTime: talk.endTime ?? null,
        speakers: toSpeakerNames(talk.speakers, speakers),
        voteCount: votes.reduce((sum, vote) => sum + vote.count, 0),
        commentCount: comments.length,
        votes,
        comments,
    }
}

export const buildProjectExport = ({
    project,
    voteItems,
    talks,
    speakers,
    talkVotes,
    exportedAt,
}: ProjectExportInput): ProjectExport => {
    const exportedVoteItems = toExportedVoteItems(voteItems)
    return {
        project: {
            id: project.id,
            name: project.name,
            exportedAt: exportedAt.toISOString(),
        },
        voteItems: exportedVoteItems,
        talks: talks.map((talk) =>
            toExportedTalk(
                talk,
                exportedVoteItems,
                speakers,
                talkVotes[talk.id]?.votes
            )
        ),
    }
}

// Keeps letters of any script, drops what file systems reject.
export const toExportFileName = (
    projectName: string,
    suffix: string,
    extension: string
): string => {
    const base = projectName
        .trim()
        .replace(/[\\/:*?"<>|\s]+/g, '-')
        .replace(/^-+|-+$/g, '')
    return `${base || 'event'}-openfeedback-${suffix}.${extension}`
}
