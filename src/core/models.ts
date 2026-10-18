// Domain models shared across the app. They mirror the Firestore documents
// (projects, talks, speakers, userVotes, sessionVotes, organizations, users,
// invites) as written by the admin/feedback apps and the Cloud Functions
// (functions/src/types, functions/src/triggers/models). Fields are optional
// wherever older or imported documents may not have them.
import type firebase from 'firebase/compat/app'
import type {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_STATUS_HIDDEN,
    VOTE_TYPE_BOOLEAN,
    VOTE_TYPE_SEPARATOR,
    VOTE_TYPE_TEXT,
    VOTE_TYPE_TEXT_PLUS,
    VOTE_TYPE_TITLE,
} from './contants'

// ---------------------------------------------------------------------------
// Firestore primitives
// ---------------------------------------------------------------------------

export type Timestamp = firebase.firestore.Timestamp
export type FieldValue = firebase.firestore.FieldValue
/**
 * A date field as held client-side: a `Timestamp` once read back from
 * Firestore, or the `serverTimestamp()` sentinel on a freshly written object.
 */
export type FirestoreDate = Timestamp | FieldValue

// ---------------------------------------------------------------------------
// Setup types (where talks & speakers come from)
// ---------------------------------------------------------------------------

export type SetupType = 'openfeedbackv1' | 'jsonurl' | 'hoverboardv2'
/** Wizard only, never persisted: imports a JSON file into an openfeedbackv1 event. */
export type WizardSetupType = SetupType | 'jsonimport'

/** `config` for `hoverboardv2`: a Firebase web config of the Hoverboard project. */
export interface HoverboardV2Config {
    projectId: string
    apiKey: string
    databaseURL: string
}

/** `config` for `jsonurl`. */
export interface JsonUrlConfig {
    jsonUrl: string
}

/** Project `config` document field, its keys depend on `setupType`. */
export type ProjectConfig = Partial<HoverboardV2Config & JsonUrlConfig>

// ---------------------------------------------------------------------------
// Vote items (the voting form)
// ---------------------------------------------------------------------------

export type VoteItemType =
    | typeof VOTE_TYPE_BOOLEAN
    | typeof VOTE_TYPE_TEXT
    | typeof VOTE_TYPE_TITLE
    | typeof VOTE_TYPE_SEPARATOR

export interface VoteItem {
    id: string
    type: VoteItemType
    /** Default label. `null` for separators. */
    name: string | null
    position?: number
    /** Translated labels keyed by language code (e.g. `fr`, `en-US`). */
    languages?: Record<string, string>
    /** Client-only: item added in the form and not saved yet. */
    local?: boolean
    /** Client-only: previous id when the type of a saved item changed. */
    oldId?: string
}

// ---------------------------------------------------------------------------
// Projects (events)
// ---------------------------------------------------------------------------

export interface Project {
    id: string
    name: string
    /** uid of the creator. */
    owner: string
    /** uids allowed to administrate the project (owner included). */
    members: string[]
    organizationId?: string
    setupType: SetupType
    config?: ProjectConfig
    voteItems?: VoteItem[]
    /** Hex colors without `#`, the first one is the accent color. */
    chipColors?: string[]
    /** Additional languages of the voting form. */
    languages?: string[]
    favicon?: string
    logoSmall?: string
    scheduleLink?: string
    hideEventName?: boolean
    restrictVoteRange?: boolean
    /** ISO 8601 date-time, `null`/missing for no restriction. */
    voteStartTime?: string | null
    /** ISO 8601 date-time, `null`/missing for no restriction. */
    voteEndTime?: string | null
    hideVotesUntilUserVote?: boolean
    disableSoloTalkRedirect?: boolean
    displayFullDates?: boolean
    /** Live-update the vote results (onSnapshot) instead of a single read. */
    liveUserVotes?: boolean
    createdAt?: Timestamp
    updatedAt?: Timestamp
}

/** Member-only doc `projects/{id}/private/integration`. */
export interface ProjectIntegration {
    apiKey: string
    /** ISO 8601 date-time. */
    apiKeyLastUsedAt?: string
}

// ---------------------------------------------------------------------------
// Talks & speakers (projects/{id}/talks, projects/{id}/speakers, or JSON/Hoverboard)
// ---------------------------------------------------------------------------

export interface Talk {
    id: string
    title: string
    /** Speaker ids. */
    speakers?: string[]
    tags?: string[]
    trackTitle?: string
    /** ISO 8601 date-time. */
    startTime?: string | null
    /** ISO 8601 date-time. */
    endTime?: string | null
    /** Not listed in the feedback app (breaks, lunch...). */
    hideInFeedback?: boolean
    createdAt?: FirestoreDate
    updatedAt?: FirestoreDate
}

/** A talk before it is saved (no id yet). */
export type NewTalk = Omit<Talk, 'id'>

export interface SpeakerSocial {
    name: string
    link: string
}

export interface Speaker {
    id: string
    name: string
    photoUrl?: string
    company?: string
    socials?: SpeakerSocial[]
    createdAt?: FirestoreDate
    updatedAt?: FirestoreDate
}

/** A speaker before it is saved (no id yet). */
export type NewSpeaker = Omit<Speaker, 'id'>

export type TalksMap = Record<string, Talk>
export type SpeakersMap = Record<string, Speaker>

// ---------------------------------------------------------------------------
// User votes (projects/{id}/userVotes/{voteId})
// ---------------------------------------------------------------------------

export type VoteStatus =
    | typeof VOTE_STATUS_ACTIVE
    | typeof VOTE_STATUS_DELETED
    | typeof VOTE_STATUS_HIDDEN

export interface Vote {
    id: string
    projectId: string
    talkId: string
    voteItemId: string
    userId: string
    status: VoteStatus
    createdAt: FirestoreDate
    updatedAt: FirestoreDate
    /** Only on a vote of a `text` vote item. */
    text?: string
    /** Set when the vote is an up-vote ("+1") on another user's text vote. */
    voteType?: typeof VOTE_TYPE_TEXT_PLUS
    /** For `textPlus` votes: id of the up-voted text vote. */
    voteId?: string
    /** Client-only: optimistic vote not yet written to Firestore. */
    pending?: boolean
}

/** The current user's votes keyed by vote id. */
export type VotesMap = Record<string, Vote>

// ---------------------------------------------------------------------------
// Aggregated votes (projects/{id}/sessionVotes/{talkId}), written by functions
// ---------------------------------------------------------------------------

/**
 * One text vote inside the aggregation. Every field is optional because a
 * deleted text vote is kept as an empty object `{}`.
 */
export interface AggregatedTextVote {
    /** Client-only: the key (vote id) copied into the value. */
    id?: string
    text?: string
    userId?: string
    /** Number of up-votes, the author's own vote included. */
    plus?: number
    createdAt?: Timestamp | null
    updatedAt?: Timestamp | null
}

/** Text votes of one vote item, keyed by vote id. */
export type AggregatedTextVotes = Record<string, AggregatedTextVote>

/** A boolean vote item holds a counter, a text vote item holds its text votes. */
export type AggregatedVoteItemValue = number | AggregatedTextVotes

/** The `sessionVotes/{talkId}` document: values keyed by vote item id. */
export type AggregatedTalkVotes = Record<string, AggregatedVoteItemValue>

/** Aggregated votes of a talk as kept in the feedback store (adds the talk `id`). */
export interface TalkVotes {
    id?: string
    [voteItemId: string]: AggregatedVoteItemValue | string | undefined
}

/** Aggregated votes of every loaded talk, keyed by talk id. */
export type ProjectTalkVotes = Record<string, TalkVotes>

// ---------------------------------------------------------------------------
// Organizations (organizations/{id})
// ---------------------------------------------------------------------------

export interface Organization {
    id: string
    name: string
    ownerUserId: string
    adminUserIds: string[]
    editorUserIds: string[]
    viewerUserIds: string[]
    favicon?: string
    logoSmall?: string
    languages?: string[]
    chipColors?: string[]
    voteItems?: VoteItem[]
    disableSoloTalkRedirect?: boolean
    hideVotesUntilUserVote?: boolean
    displayFullDates?: boolean
    createdAt?: Timestamp
    updatedAt?: Timestamp
}

/** Member-only doc `organizations/{id}/private/integration`. */
export interface OrganizationIntegration {
    apiKey: string
    /** ISO 8601 date-time. */
    apiKeyLastUsedAt?: string
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/** The Firebase Auth user (compat API). */
export type AuthUser = firebase.User

/** The `users/{uid}` document, written on admin login. */
export interface User {
    uid: string
    displayName?: string | null
    photoURL?: string | null
    email?: string | null
    emailVerified?: boolean
    phoneNumber?: string | null
    createdAt?: FirestoreDate
    updatedAt?: FirestoreDate
}

// ---------------------------------------------------------------------------
// Invites (invites/{id})
// ---------------------------------------------------------------------------

export type InviteStatus = 'new' | 'emailSent' | 'completed' | 'error'

interface BaseInvite {
    id: string
    /** Email of the invited person. */
    destinationUserInfo: string
    originUserId: string
    originUserName?: string | null
    originUserPhotoURL?: string
    status: InviteStatus
    createdAt?: FirestoreDate
    updatedAt?: FirestoreDate
}

export interface ProjectInvite extends BaseInvite {
    projectId: string
    projectName: string
}

export interface OrganizationInvite extends BaseInvite {
    organizationId: string
    organizationName: string
    /** Organization role given to the invited user ('Admin', 'Editor', 'Viewer'). */
    role: string
}

export type Invite = ProjectInvite | OrganizationInvite
