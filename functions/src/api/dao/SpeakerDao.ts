import { App as FirebaseApp } from 'firebase-admin/app'
import { EventAccess } from '../services/eventAccess'
import { CreateSpeaker, Speaker, UpdateSpeaker } from '../schemas'
import {
    createResource,
    EventResource,
    getResource,
    listResources,
    textOrUndefined,
    updateResource,
} from './eventResources'

const speakers: EventResource<Omit<Speaker, 'id' | 'revision'>> = {
    collection: 'speakers',
    map: (data) => ({ name: textOrUndefined(data.name) }),
}

export class SpeakerDao {
    public static list(
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
    }

    public static get(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: EventAccess,
        speakerId: string
    ) {
        return getResource(firebaseApp, projectId, access, speakers, speakerId)
    }

    public static create(
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
    }

    public static update(
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
    }
}
