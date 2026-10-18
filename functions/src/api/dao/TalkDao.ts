import { App as FirebaseApp } from 'firebase-admin/app'
import { DocumentReference, Transaction } from 'firebase-admin/firestore'
import { BadRequestError, HttpError } from '../others/Errors'
import { EventAccess } from '../services/eventAccess'
import { CreateTalk, Talk, UpdateTalk } from '../schemas'
import {
    createResource,
    EventResource,
    getResource,
    listResources,
    textOrUndefined,
    updateResource,
} from './eventResources'

const talks: EventResource<Omit<Talk, 'id' | 'revision'>> = {
    collection: 'talks',
    map: (data) => ({
        title: textOrUndefined(data.title),
        speakers: Array.isArray(data.speakers)
            ? data.speakers.filter((id) => typeof id === 'string')
            : [],
    }),
    // Every admin UI writer sets these; the attendee app groups talks by track.
    defaults: () => ({ trackTitle: '', tags: [] }),
}

export class TalkDao {
    public static list(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        limit: number,
        after?: string
    ) {
        return listResources(firebaseApp, projectId, access, talks, {
            limit,
            after,
        })
    }

    public static get(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        talkId: string
    ) {
        return getResource(firebaseApp, projectId, access, talks, talkId)
    }

    public static create(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        input: CreateTalk
    ) {
        const { id, ...rest } = input
        const fields = { ...rest, speakers: rest.speakers ?? [] }
        return createResource(firebaseApp, projectId, access, talks, {
            id,
            fields,
            check: async (transaction, event) => {
                if (id !== undefined)
                    await assertNoLeftoverVotes(transaction, event, id)
                await assertSpeakersExist(transaction, event, fields.speakers)
            },
        })
    }

    public static update(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        talkId: string,
        input: UpdateTalk
    ) {
        const { revision, ...fields } = input
        return updateResource(firebaseApp, projectId, access, talks, {
            id: talkId,
            revision,
            fields,
            check: async (transaction, event, previous) => {
                if (fields.speakers)
                    await assertSpeakersExist(
                        transaction,
                        event,
                        fields.speakers,
                        previous.speakers
                    )
            },
        })
    }
}

// Deleting a talk in the admin UI leaves its votes behind; reusing its ID
// would attach them to the new talk.
const assertNoLeftoverVotes = async (
    transaction: Transaction,
    event: DocumentReference,
    talkId: string
) => {
    const [aggregate, votes] = await Promise.all([
        transaction.get(event.collection('sessionVotes').doc(talkId)),
        transaction.get(
            event.collection('userVotes').where('talkId', '==', talkId).limit(1)
        ),
    ])
    if (aggregate.exists || !votes.empty) {
        throw new HttpError(
            409,
            'Record ID still has votes from a deleted talk'
        )
    }
}

// Only IDs the request adds are checked: references the talk already holds
// (e.g. to a speaker deleted in the admin UI) must not block edits.
const assertSpeakersExist = async (
    transaction: Transaction,
    event: DocumentReference,
    speakerIds: string[],
    previous?: unknown
) => {
    const known = new Set(Array.isArray(previous) ? previous : [])
    const added = speakerIds.filter((id) => !known.has(id))
    if (added.length === 0) return
    const speakers = await transaction.getAll(
        ...added.map((id) => event.collection('speakers').doc(id))
    )
    const missing = speakers.filter((doc) => !doc.exists).map((doc) => doc.id)
    if (missing.length > 0) {
        throw new BadRequestError(
            `A talk references unknown speakers: ${missing.join(', ')}`
        )
    }
}
