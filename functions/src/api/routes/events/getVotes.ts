import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { ErrorSchema, IdSchema } from '../../schemas'
import { authenticateRequest } from '../../plugins/apiKeyPlugin'
import { ProjectDao } from '../../dao/ProjectDao'
import { NotFoundError } from '../../others/Errors'
import {
    buildEventVotesExport,
    ExportableProject,
} from '../../services/exportEventVotes'

const ParamsSchema = Type.Object({
    projectId: IdSchema,
})

const EventVotesResponseSchema = Type.Object({
    projectId: IdSchema,
    sessionsCount: Type.Integer({ minimum: 0 }),
    // Each row has fixed session fields plus one column per vote item, so the
    // shape is open (additionalProperties).
    sessions: Type.Array(Type.Record(Type.String(), Type.Any())),
})

export const getEventVotesRoute: FastifyPluginAsync = async (server) => {
    server.get(
        '/:projectId/votes',
        {
            schema: {
                description:
                    'Export all session votes for an event (project). ' +
                    'Accepts an event API key (`ofproj_`) for its own event, ' +
                    'or an organization key (`oforg_`) for any event in that ' +
                    'organization.',
                tags: ['Events'],
                params: ParamsSchema,
                response: {
                    200: EventVotesResponseSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    404: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request) => {
            const { projectId } = request.params as { projectId: string }

            // Authorize against the authenticated key. Use 404 (not 403) on a
            // mismatch so we never reveal which event ids exist.
            let project: ExportableProject
            if (request.project) {
                if (request.project.id !== projectId) {
                    throw new NotFoundError('Event not found')
                }
                project = request.project as unknown as ExportableProject
            } else if (request.organization) {
                const resolved = await ProjectDao.getProjectFromId(
                    server.firebase,
                    projectId
                )
                if (resolved.organizationId !== request.organization.id) {
                    throw new NotFoundError('Event not found')
                }
                project = resolved as unknown as ExportableProject
            } else {
                // authenticateRequest guarantees one of the two; defensive only.
                throw new NotFoundError('Event not found')
            }

            const sessions = await buildEventVotesExport(
                server.firebase,
                project
            )

            return {
                projectId,
                sessionsCount: sessions.length,
                sessions,
            }
        }
    )
}
