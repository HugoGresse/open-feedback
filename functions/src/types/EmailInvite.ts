import { InvitationType } from './InvitationType'

interface BaseEmailInvite {
    type: InvitationType
    destinationUserInfo: string
    originUserName: string
}

export interface OrganizationEmailInvite extends BaseEmailInvite {
    type: InvitationType.OrganizationInvitationType
    organizationId: string
    organizationName: string
}

export interface ProjectEmailInvite extends BaseEmailInvite {
    type: InvitationType.ProjectInvitationType
    projectId: string
    projectName: string
}

export type EmailInvite = OrganizationEmailInvite | ProjectEmailInvite
