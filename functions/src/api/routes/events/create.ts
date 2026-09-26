import { FastifyPluginAsync } from 'fastify'
import {
    CreateEvent,
    CreateEventSchema,
    ErrorSchema,
    EventSchema,
} from '../../schemas'
import { authenticateRequest } from '../../plugins/apiKeyPlugin'
import { ProjectDao } from '../../dao/ProjectDao'
import { HttpError } from '../../others/Errors'
import { publicEvent } from '../../services/eventSettings'

export const createEventRoute: FastifyPluginAsync = async (server) => {
    server.post<{ Body: CreateEvent }>(
        '/',
        {
            schema: {
                description:
                    'Create an event in the organization linked to an organization API key (`oforg_`). ' +
                    'Inherits organization settings and voting form. Defaults to openfeedbackv1. ' +
                    'An ID is generated if omitted; an existing ID returns 409. ' +
                    'The event API key is stored privately and is available in the admin UI.',
                tags: ['Events'],
                body: CreateEventSchema,
                response: {
                    201: EventSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    409: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request, reply) => {
            if (!request.organization) {
                throw new HttpError(403, 'An organization API key is required')
            }
            const project = await ProjectDao.createProject(
                server.firebase,
                request.organization,
                request.body
            )
            return reply.code(201).send(publicEvent(project))
        }
    )
}
