import firebaseFunctionsTest from 'firebase-functions-test'
import { userInviteCreated } from './userInvite'

const test = firebaseFunctionsTest()

// Due to an issue with the config, it seems that when the mockConfig is set once, it doesn't work well with the other
// future call...
describe('userInviteCreated', () => {
    const invite = {
        id: '001',
        projectId: 'projectId1',
        projectName: 'Project Name',
        originUserName: 'Hugo G',
        destinationUserInfo: 'email@example.com',
    }

    it('should reject when a user is invited to a project while no config is specified', async () => {
        test.mockConfig({})
        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: invite.id,
            data: () => invite,
        }
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(
            new Error('Missing app environment')
        )
    })
})
