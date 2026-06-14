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
        .map((v) => `${v.text} (${v.plus ?? 0})`)
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
    const data = await fetchEventData(jsonUrl)

    const sessions = Object.keys(data.sessions || {}).map((id) => ({
        id,
        ...data.sessions[id],
    }))
    // Index vote items by id once instead of re-scanning per session.
    const voteItemsById = new Map(
        (project.voteItems || []).map((item) => [item.id, item])
    )

    // Fetch every session's votes concurrently; sequential awaits would be slow
    // and risk route timeouts on events with many sessions. Promise.all keeps
    // the original session order.
    return Promise.all(
        sessions.map(async (session) => {
            const sessionVotes = (await db
                .collection('projects')
                .doc(project.id)
                .collection('sessionVotes')
                .doc(session.id)
                .get()
                .then((doc) => doc.data())) as
                | Record<string, unknown>
                | undefined

            const speakersName = (session.speakers || [])
                .map((speakerId) => data.speakers?.[speakerId]?.name)
                .filter((name): name is string => !!name)
                .join(', ')

            const voteColumns = Object.keys(sessionVotes || {}).reduce<
                Record<string, string>
            >((acc, key) => {
                const voteItem = voteItemsById.get(key)
                if (voteItem?.name) {
                    acc[voteItem.name] = voteValueToString(sessionVotes![key])
                }
                return acc
            }, {})

            return {
                sessionId: session.id,
                title: session.title,
                speakers: (session.speakers || []).join(', '),
                speakersName,
                tags: (session.tags || []).join(', '),
                trackTitle: session.trackTitle,
                ...voteColumns,
            }
        })
    )
}

// Load the event's public sessions/speakers JSON, turning a bad/expired URL or
// unparseable body into a 400 instead of an opaque 500.
const fetchEventData = async (jsonUrl: string): Promise<OpenFeedbackData> => {
    let response: Response
    try {
        response = await fetch(jsonUrl)
    } catch {
        throw new BadRequestError(
            'Could not reach the event public data URL (config.jsonUrl).'
        )
    }
    if (!response.ok) {
        throw new BadRequestError(
            `The event public data URL returned ${response.status}.`
        )
    }
    try {
        return (await response.json()) as OpenFeedbackData
    } catch {
        throw new BadRequestError(
            'The event public data URL did not return valid JSON.'
        )
    }
}
