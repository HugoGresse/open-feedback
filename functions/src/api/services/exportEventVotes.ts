import { App as FirebaseApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { BadRequestError } from '../others/Errors'

interface VoteItem {
    id: string
    name: string
}

// The fields of a project doc this export needs. The project doc carries more,
// but only these matter for building the vote export.
export interface ExportableProject {
    id: string
    voteItems?: VoteItem[]
    config?: { jsonUrl?: string }
}

export interface EventVoteRow {
    sessionId: string
    title?: string
    speakers?: string
    speakersName?: string
    tags?: string
    trackTitle?: string
    // One extra column per vote item, keyed by the vote item name.
    [voteColumn: string]: string | undefined
}

interface OpenFeedbackData {
    sessions: Record<string, Session>
    speakers: Record<string, { name?: string }>
}

interface Session {
    title?: string
    speakers?: string[]
    tags?: string[]
    trackTitle?: string
}

// Turn a single sessionVotes value into a flat string. A value is either a
// scalar or a map of vote entries shaped like { text, plus }.
const voteValueToString = (voteResult: unknown): string => {
    if (typeof voteResult !== 'object' || voteResult === null) {
        return String(voteResult)
    }
    return Object.values(
        voteResult as Record<string, { text?: string; plus?: number }>
    )
        .filter((v) => !!v?.text)
        .map((v) => `${v.text} (${v.plus})`)
        .join(', ')
        .replaceAll('\n', ' ')
}

/**
 * Build the per-session vote export for an event (project), reusing the core
 * transformation of scripts/exportAllEventVotes.ts: read the event's public
 * sessions/speakers JSON, then join each session with its `sessionVotes` doc
 * and flatten votes into columns keyed by vote-item name.
 *
 * Returns plain rows (no CSV/file IO — that stays in the script).
 */
export const buildEventVotesExport = async (
    firebaseApp: FirebaseApp,
    project: ExportableProject
): Promise<EventVoteRow[]> => {
    const jsonUrl = project.config?.jsonUrl
    if (!jsonUrl) {
        throw new BadRequestError(
            'This event has no public data URL (config.jsonUrl); nothing to export.'
        )
    }

    const db = getFirestore(firebaseApp)
    const data = (await fetch(jsonUrl).then((res) =>
        res.json()
    )) as OpenFeedbackData

    const sessions = Object.keys(data.sessions || {}).map((id) => ({
        id,
        ...data.sessions[id],
    }))
    const voteItems = project.voteItems || []

    const rows: EventVoteRow[] = []
    for (const session of sessions) {
        const sessionVotes = (await db
            .collection('projects')
            .doc(project.id)
            .collection('sessionVotes')
            .doc(session.id)
            .get()
            .then((doc) => doc.data())) as Record<string, unknown> | undefined

        const speakersName = (session.speakers || [])
            .map((speakerId) => data.speakers?.[speakerId]?.name)
            .filter((name): name is string => !!name)
            .join(', ')

        const voteColumns = Object.keys(sessionVotes || {}).reduce<
            Record<string, string>
        >((acc, key) => {
            const voteItem = voteItems.find((item) => item.id === key)
            if (voteItem?.name) {
                acc[voteItem.name] = voteValueToString(sessionVotes![key])
            }
            return acc
        }, {})

        rows.push({
            sessionId: session.id,
            title: session.title,
            speakers: (session.speakers || []).join(', '),
            speakersName,
            tags: (session.tags || []).join(', '),
            trackTitle: session.trackTitle,
            ...voteColumns,
        })
    }

    return rows
}
