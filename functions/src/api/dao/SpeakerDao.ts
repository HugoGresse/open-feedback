import type { App as FirebaseApp } from 'firebase-admin/app'
import type { EventAccess } from '../services/eventAccess'
import type { CreateSpeaker, Speaker, UpdateSpeaker } from '../schemas'
import {
    createResource,
    type EventResource,
    getResource,
    listResources,
    textOrUndefined,
    updateResource,
} from './eventResources'

const speakers: EventResource<Omit<Speaker, 'id' | 'revision'>> = {
    collection: 'speakers',
    map: (data) => ({ name: textOrUndefined(data.name) }),
}

export const SpeakerDao = {
    list(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        limit: number,
        after?: string
    ) {
        return listResources(firebaseApp, projectId, access, speakers, {
            limit,
            after,
        })
    },

    get(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        speakerId: string
    ) {
        return getResource(firebaseApp, projectId, access, speakers, speakerId)
    },

    create(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        input: CreateSpeaker
    ) {
        const { id, ...fields } = input
        return createResource(firebaseApp, projectId, access, speakers, {
            id,
            fields,
        })
    },

    update(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        speakerId: string,
        input: UpdateSpeaker
    ) {
        const { revision, ...fields } = input
        return updateResource(firebaseApp, projectId, access, speakers, {
            id: speakerId,
            revision,
            fields,
        })
    },
}
