// Shared normalization for the OpenFeedback JSON event model
// ({ sessions, speakers }). Mirrors the cleanup historically done in
// JsonUrlApi: coerce ids to strings and keep only string entries in the
// session speakers/tags arrays. Used by both the JSON-file validation
// (JsonImportApi) and the Firestore import action so both see identical data.

export interface SpeakerData {
    id: string
    [key: string]: unknown
}

export interface SessionData {
    id: string
    speakers?: unknown
    tags?: unknown
    [key: string]: unknown
}

export interface EventData {
    sessions?: Record<string, SessionData>
    speakers?: Record<string, SpeakerData>
    [key: string]: unknown
}

const isString = (value: unknown): value is string => typeof value === 'string'

const filterStrings = (value: unknown): unknown =>
    Array.isArray(value) ? value.filter(isString) : value

export const normalizeEventData = (
    data: EventData | null | undefined
): EventData => {
    const sessions: Record<string, SessionData> = {}
    Object.values(data?.sessions || {}).forEach((session) => {
        const id = '' + session.id
        sessions[id] = {
            ...session,
            id,
            speakers: filterStrings(session.speakers),
            tags: filterStrings(session.tags),
        }
    })

    const speakers: Record<string, SpeakerData> = {}
    Object.values(data?.speakers || {}).forEach((speaker) => {
        const id = '' + speaker.id
        speakers[id] = {
            ...speaker,
            id,
        }
    })

    return {
        ...data,
        sessions,
        speakers,
    }
}

export interface ParseResult {
    data: EventData | null
    error: string | null
}

// Parse raw JSON text (file contents or pasted text) into normalized event
// data. Returns a friendly error string instead of throwing so the form can
// surface it inline.
export const parseEventJson = (text: string): ParseResult => {
    if (!text || !text.trim()) {
        return { data: null, error: null }
    }
    let parsed: unknown
    try {
        parsed = JSON.parse(text)
    } catch (e) {
        return { data: null, error: (e as Error).message }
    }
    if (
        typeof parsed !== 'object' ||
        parsed === null ||
        Array.isArray(parsed)
    ) {
        return {
            data: null,
            error: 'The JSON must be an object with "sessions" and "speakers" keys.',
        }
    }
    return { data: normalizeEventData(parsed as EventData), error: null }
}
