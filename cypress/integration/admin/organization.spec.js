import { stringGenerator } from '../../utils/generateString'
import { AdminApp } from '../../support/AdminApp'
import { FeedbackApp } from '../../support/FeedbackApp'

describe('Test organization as owner role', function () {
    const data = {
        orgName: `organizationOwner ${stringGenerator()}`,
        projectName: stringGenerator(),
        talk1Name: 'Talk-title-1',
        voteItem: 'Suis-je-une-carotte?',
    }

    const app = new AdminApp()
    const feedback = new FeedbackApp()

    beforeEach(() => {
        app.open()
        app.loginIfNeeded()
    })

    it('Create a new organization, change voting form, langs, theme, and verify on project', function () {
        app.organization.newOrganization(data.orgName)
        app.organization.assertNewOrgScreen(data.orgName, ['currentOne?'])

        app.organization.openUserRoleInfo(0)
        app.organization.assertUserRoleInfo()
        app.organization.closeUserRoleInfo()

        app.organization.openVotingForm()

        app.settings.addLanguage('Deutsch')
        app.settings.setForceSoloTalkRedirect(false)

        const langLabel =
            'Deutsch (de) - You can edit the languages from the Event & Theme page'

        app.votingForm.assertVoteItemLength(9, langLabel, false)
        app.votingForm.addVoteItemWithLang(
            data.voteItem,
            data.voteItem,
            langLabel
        )

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        app.votingForm.save(false, true)

        app.organization.close()

        app.create(data.projectName, data.orgName)

        cy.contains(data.orgName)
        cy.contains(data.projectName)

        app.openTalks()
        app.addTalk(data.talk1Name, 'track1', 'tag')

        app.votingForm.open()
        app.votingForm.assertVoteItemLength(20, langLabel)

        app.openFeedback()
        feedback.assertTalkInList(data.talk1Name)

        feedback.openTalk(data.talk1Name)
        feedback.assertInTalk(data.talk1Name, [data.voteItem])
    })
})
