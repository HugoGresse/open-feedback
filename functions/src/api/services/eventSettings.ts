import { randomInt } from 'node:crypto'
import { BadRequestError } from '../others/Errors'
import { EventSchema, UpdateEvent } from '../schemas'
import { Project } from '../../types/Project'

// Top-level app routes (see src/App.jsx and projectUtils.reservedProjectIds).
// An event with one of these IDs would be shadowed by the route. React Router
// matches case-insensitively, hence the lowercase comparison.
const RESERVED_EVENT_IDS = [
    'admin',
    'superadmin',
    'l',
    'contact',
    'help',
    'legal',
]

type VoteItem = Record<string, unknown> & {
    languages?: Record<string, unknown>
}

// Keep all responses on the same allowlist, including legacy project documents
// that may still contain an API key or other internal fields.
export const publicEvent = (project: Project) =>
    Object.fromEntries(
        Object.entries(project).filter(([key]) =>
            Object.hasOwn(EventSchema.properties, key)
        )
    )

export const assertEventIdAllowed = (id: string) => {
    if (RESERVED_EVENT_IDS.includes(id.toLowerCase())) {
        throw new BadRequestError(`Event ID "${id}" is reserved`)
    }
}

/**
 * Validates cross-field invariants of an event. When `changes` is given (a
 * partial update), only the invariants involving a changed field are checked,
 * so legacy data the caller did not touch never blocks an unrelated update.
 */
export const validateEventSettings = (
    event: UpdateEvent,
    changes: UpdateEvent = event
) => {
    if ('setupType' in changes || 'config' in changes) {
        validateSetup(event)
    }
    if ('voteStartTime' in changes || 'voteEndTime' in changes) {
        validateVoteRange(event)
    }
}

const validateSetup = (event: UpdateEvent) => {
    if (event.setupType === 'jsonurl' && !event.config?.jsonUrl) {
        throw new BadRequestError('jsonurl events require config.jsonUrl')
    }
    if (
        event.setupType === 'hoverboardv2' &&
        (!event.config?.projectId ||
            !event.config.apiKey ||
            !event.config.databaseURL)
    ) {
        throw new BadRequestError(
            'hoverboardv2 events require config.projectId, config.apiKey and config.databaseURL'
        )
    }
}

const validateVoteRange = (event: UpdateEvent) => {
    if (!!event.voteStartTime !== !!event.voteEndTime) {
        throw new BadRequestError(
            'voteStartTime and voteEndTime must both be set or both be null'
        )
    }
    if (
        event.voteStartTime &&
        event.voteEndTime &&
        Date.parse(event.voteStartTime) >= Date.parse(event.voteEndTime)
    ) {
        throw new BadRequestError('voteEndTime must be after voteStartTime')
    }
}

/**
 * Drops vote item translations for languages no longer enabled on the event,
 * mirroring the admin UI (editProject.fixVoteItemLanguages). Otherwise
 * attendees whose browser matches a removed language still see its labels.
 * Returns null when nothing changes.
 */
export const pruneVoteItemLanguages = (
    voteItems: unknown,
    languages: string[]
): VoteItem[] | null => {
    if (!Array.isArray(voteItems)) {
        return null
    }
    let changed = false
    const pruned = (voteItems as VoteItem[]).map((item) => {
        if (!item.languages) {
            return item
        }
        const kept = Object.fromEntries(
            Object.entries(item.languages).filter(([lang]) =>
                languages.includes(lang)
            )
        )
        if (Object.keys(kept).length === Object.keys(item.languages).length) {
            return item
        }
        changed = true
        const { languages: _removed, ...rest } = item
        return Object.keys(kept).length > 0
            ? { ...rest, languages: kept }
            : rest
    })
    return changed ? pruned : null
}

const VOTE_ITEM_ID_CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const newVoteItemId = () =>
    Array.from(
        { length: 20 },
        () => VOTE_ITEM_ID_CHARS[randomInt(VOTE_ITEM_ID_CHARS.length)]
    ).join('')

// Same items as the admin UI's fillDefaultVotingForm (English labels).
const DEFAULT_VOTE_ITEMS: [string, 'boolean' | 'text'][] = [
    ['Fun 😃', 'boolean'],
    ["I've learned a lot 🤓", 'boolean'],
    ['Very interesting 👍', 'boolean'],
    ['Good speaker 👏', 'boolean'],
    ['Not clear 🧐', 'boolean'],
    ['Too technical 🤖', 'boolean'],
    ['Lack of demo/example 🤔', 'boolean'],
    ['Too complex 🤯', 'boolean'],
    ['Comment', 'text'],
]

export const defaultVoteItems = () =>
    DEFAULT_VOTE_ITEMS.map(([name, type], position) => ({
        id: newVoteItemId(),
        name,
        position,
        type,
    }))
