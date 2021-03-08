import { stringGenerator } from '../../utils/generateString'
import { AdminApp } from '../../support/AdminApp'

describe('Test organization as owner role', function () {
    const data = {
        orgName: `organizationOwner ${stringGenerator()}`,
        projectName: stringGenerator(),
        talk1Name: 'Talk title 1',
    }

    const app = new AdminApp()

    beforeEach(() => {
        app.open()
        app.loginIfNeeded()
    })

    it('Create a new organization, change voting form, langs, theme, and verify on project', function () {
        // Test commit hook
    })
})
