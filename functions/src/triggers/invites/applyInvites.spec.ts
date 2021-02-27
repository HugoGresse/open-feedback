import { applyInvites } from './applyInvites'
import { getFirestoreMocksAndInit } from '../../testUtils/firestoreStub'
import { InvitationType } from '../../types/InvitationType'
import { arrayUnion, serverTimestamp } from '../../helpers/firebaseInit'

describe('applyInvites', () => {
    const inviteProject = {
        id: '001',
        projectId: 'projectId1',
        originUserName: 'Hugo G',
        destinationUserInfo: 'email@example.com',
    }
    const inviteOrganization = {
        id: '001',
        organizationId: 'orgId1',
        originUserName: 'Hugo G',
        destinationUserInfo: 'email@example.com',
        role: 'Viewer',
    }
    const USER_ID = '01404201sxqSA'

    it('should not apply an invite on a project and successfully update the invite at the end', async () => {
        const { update, doc } = getFirestoreMocksAndInit()

        update.mockImplementationOnce(() =>
            Promise.reject('projects update rejected!')
        )
        update.mockImplementationOnce(() =>
            Promise.resolve('invites update done')
        )

        const result = await applyInvites(
            inviteProject.id,
            InvitationType.ProjectInvitationType,
            USER_ID,
            inviteProject.projectId
        )
        expect(doc).toHaveBeenCalledWith(inviteProject.projectId)
        expect(update).toHaveBeenCalledTimes(2)
        expect(update).toBeCalledWith({
            members: arrayUnion(USER_ID),
            updatedAt: serverTimestamp(),
        })
        expect(update).toBeCalledWith({
            updatedAt: serverTimestamp(),
            status: 'error',
            error: '"projects update rejected!"',
        })
        expect(result).toEqual('invites update done')
    })
    it('should apply invite on a project and successfully update the invite at the end', async () => {
        const { update, doc } = getFirestoreMocksAndInit()

        update.mockImplementationOnce(() =>
            Promise.resolve('projects update done')
        )
        update.mockImplementationOnce(() =>
            Promise.resolve('invites update done')
        )

        const result = await applyInvites(
            inviteProject.id,
            InvitationType.ProjectInvitationType,
            USER_ID,
            inviteProject.projectId
        )
        expect(doc).toHaveBeenCalledWith(inviteProject.projectId)
        expect(update).toHaveBeenCalledTimes(2)
        expect(update).toBeCalledWith({
            members: arrayUnion(USER_ID),
            updatedAt: serverTimestamp(),
        })
        expect(update).toBeCalledWith({
            status: 'completed',
            updatedAt: serverTimestamp(),
        })
        expect(result).toEqual('invites update done')
    })

    it('should apply invite for Viewer role on an organization and successfully update the invite at the end', async () => {
        const { update, doc } = getFirestoreMocksAndInit()

        update.mockImplementationOnce(() =>
            Promise.resolve('organization update done')
        )
        update.mockImplementationOnce(() =>
            Promise.resolve('invites update done')
        )

        const result = await applyInvites(
            inviteOrganization.id,
            InvitationType.OrganizationInvitationType,
            USER_ID,
            inviteOrganization.organizationId,
            inviteOrganization.role
        )
        expect(doc).toHaveBeenCalledWith(inviteOrganization.organizationId)
        expect(update).toHaveBeenCalledTimes(2)
        expect(update).toBeCalledWith({
            updatedAt: serverTimestamp(),
            viewerUserIds: arrayUnion(USER_ID),
        })
        expect(update).toBeCalledWith({
            status: 'completed',
            updatedAt: serverTimestamp(),
        })
        expect(result).toEqual('invites update done')
    })

    it('should apply invite for Editor role on an organization and successfully update the invite at the end', async () => {
        const { update, doc } = getFirestoreMocksAndInit()

        update.mockImplementationOnce(() =>
            Promise.resolve('organization update done')
        )
        update.mockImplementationOnce(() =>
            Promise.resolve('invites update done')
        )

        const result = await applyInvites(
            inviteOrganization.id,
            InvitationType.OrganizationInvitationType,
            USER_ID,
            inviteOrganization.organizationId,
            'Editor'
        )
        expect(doc).toHaveBeenCalledWith(inviteOrganization.organizationId)
        expect(update).toHaveBeenCalledTimes(2)
        expect(update).toBeCalledWith({
            updatedAt: serverTimestamp(),
            viewerUserIds: arrayUnion(USER_ID),
            editorUserIds: arrayUnion(USER_ID),
        })
        expect(update).toBeCalledWith({
            status: 'completed',
            updatedAt: serverTimestamp(),
        })
        expect(result).toEqual('invites update done')
    })

    it('should apply invite for Admin role on an organization and successfully update the invite at the end', async () => {
        const { update, doc } = getFirestoreMocksAndInit()

        update.mockImplementationOnce(() =>
            Promise.resolve('organization update done')
        )
        update.mockImplementationOnce(() =>
            Promise.resolve('invites update done')
        )

        const result = await applyInvites(
            inviteOrganization.id,
            InvitationType.OrganizationInvitationType,
            USER_ID,
            inviteOrganization.organizationId,
            'Admin'
        )
        expect(doc).toHaveBeenCalledWith(inviteOrganization.organizationId)
        expect(update).toHaveBeenCalledTimes(2)
        expect(update).toBeCalledWith({
            updatedAt: serverTimestamp(),
            viewerUserIds: arrayUnion(USER_ID),
            editorUserIds: arrayUnion(USER_ID),
            adminUserIds: arrayUnion(USER_ID),
        })
        expect(update).toBeCalledWith({
            status: 'completed',
            updatedAt: serverTimestamp(),
        })
        expect(result).toEqual('invites update done')
    })

    it('should apply invite for Owner role on an organization and successfully update the invite at the end', async () => {
        const { update, doc } = getFirestoreMocksAndInit()

        update.mockImplementationOnce(() =>
            Promise.resolve('organization update done')
        )
        update.mockImplementationOnce(() =>
            Promise.resolve('invites update done')
        )

        const result = await applyInvites(
            inviteOrganization.id,
            InvitationType.OrganizationInvitationType,
            USER_ID,
            inviteOrganization.organizationId,
            'Owner'
        )
        expect(doc).toHaveBeenCalledWith(inviteOrganization.organizationId)
        expect(update).toHaveBeenCalledTimes(2)
        expect(update).toBeCalledWith({
            updatedAt: serverTimestamp(),
            viewerUserIds: arrayUnion(USER_ID),
            editorUserIds: arrayUnion(USER_ID),
            adminUserIds: arrayUnion(USER_ID),
            ownerUserId: USER_ID,
        })
        expect(update).toBeCalledWith({
            status: 'completed',
            updatedAt: serverTimestamp(),
        })
        expect(result).toEqual('invites update done')
    })

    it('should fail to apply invite on an organization due to missing role to be added to', async () => {
        const { update } = getFirestoreMocksAndInit()
        update.mockImplementationOnce(() =>
            Promise.resolve('organization update done')
        )

        return expect(
            applyInvites(
                inviteOrganization.id,
                InvitationType.OrganizationInvitationType,
                USER_ID,
                inviteOrganization.organizationId
            )
        ).rejects.toEqual(new Error('Missing role for invite'))
    })

    it('should fail to apply invites on an organization due to unknown role to be added to', async () => {
        const { update } = getFirestoreMocksAndInit()
        update.mockImplementationOnce(() =>
            Promise.resolve('organization update done')
        )

        return expect(
            applyInvites(
                inviteOrganization.id,
                InvitationType.OrganizationInvitationType,
                USER_ID,
                inviteOrganization.organizationId,
                'THIS IS NOT A GOOD ROLE, THIS IS A CAPS LOCK ROLE!'
            )
        ).rejects.toEqual(
            new Error('Unknown role to process organization invite')
        )
    })
})
