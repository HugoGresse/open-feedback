import { BadRequestError } from '../others/Errors'
import { EventSchema, UpdateEvent } from '../schemas'
import { Project } from '../../types/Project'

// Keep all responses on the same allowlist, including legacy project documents
// that may still contain an API key or other internal fields.
export const publicEvent = (project: Project) =>
    Object.fromEntries(
        Object.entries(project).filter(([key]) =>
            Object.hasOwn(EventSchema.properties, key)
        )
    )

export const validateEventSettings = (event: UpdateEvent) => {
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
