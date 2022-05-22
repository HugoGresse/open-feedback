import firebaseFunctionsTest from 'firebase-functions-test'
import { userInviteCreated } from './userInvite'
import { makeDocumentSnapshot } from '../../testUtils/firestoreStub'

const test = firebaseFunctionsTest()

// Due to an issue with the config/env, it seems that when the mockConfig is set once, it doesn't work well with the
// other future call...
describe('userInviteCreated', () => {
    const invite = {
        id: '001',
        projectId: 'projectId1',
        projectName: 'Project Name',
        originUserName: 'Hugo G',
        destinationUserInfo: 'email@example.com',
    }

    it('should reject when a user is invited to a project while no config is specified', async () => {
        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = makeDocumentSnapshot(invite, `invites/${invite.id}`)
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(
            new Error('APP_ENV is not defined in environment variables')
        )
    })
})
