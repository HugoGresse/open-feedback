import { stringGenerator } from '../../utils/generateString'
import { AdminApp, VOTE_ITEM_TYPES } from '../../support/AdminApp'
import { FeedbackApp } from '../../support/FeedbackApp'

describe('Test voting form edition', function () {
    const data = {
        projectName: `votingform ${stringGenerator()}`,
        talk1Name: 'Talk title 1',
        voteItem1: stringGenerator(),
    }

    const app = new AdminApp()
    const feedback = new FeedbackApp()

    beforeEach(() => {
        app.open()
        app.loginIfNeeded()
    })

    it('Add vote item, change type, re-order, delete some', function () {
        app.create(data.projectName)
        app.openTalks()
        app.addTalk(data.talk1Name)

        app.votingForm.open()

        app.votingForm.assertVoteItemLength(9)
        app.votingForm.addVoteItem(data.voteItem1)
        app.votingForm.assertVoteItemLength(10)
        app.votingForm.assertVoteItem(0, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        app.votingForm.moveVoteItem(0, true)
        app.votingForm.assertVoteItem(
            0,
            "I've learned a lot 🤓",
            VOTE_ITEM_TYPES.chip
        )
        app.votingForm.assertVoteItem(1, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        app.votingForm.changeVoteItemType(
            0,
            VOTE_ITEM_TYPES.chip,
            VOTE_ITEM_TYPES.text
        )
        app.votingForm.removeVoteItem(5)

        app.votingForm.save(true)

        app.openFeedback()

        feedback.openTalk(data.talk1Name)
        feedback.assertVoteItem(
            0,
            "I've learned a lot 🤓",
            VOTE_ITEM_TYPES.text
        )
        feedback.assertVoteItem(1, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        feedback.assertVoteItem(8, data.voteItem1, VOTE_ITEM_TYPES.chip)
    })

    it('Reset voting form to default', function () {
        app.create(data.projectName)
        app.openTalks()
        app.addTalk(data.talk1Name)

        app.votingForm.open()

        app.votingForm.assertVoteItemLength(9)
        app.votingForm.removeVoteItem(0)
        app.votingForm.removeVoteItem(0)
        app.votingForm.removeVoteItem(0)
        app.votingForm.removeVoteItem(0)
        app.votingForm.removeVoteItem(0)
        app.votingForm.assertVoteItemLength(4)

        app.votingForm.save(true)
        app.votingForm.reset()

        app.votingForm.assertVoteItem(0, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        app.votingForm.assertVoteItem(
            1,
            "I've learned a lot 🤓",
            VOTE_ITEM_TYPES.chip
        )

        app.openFeedback()

        feedback.openTalk(data.talk1Name)
        feedback.assertVoteItem(0, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        feedback.assertVoteItem(
            1,
            "I've learned a lot 🤓",
            VOTE_ITEM_TYPES.chip
        )
    })

    it('Additional voting form languages', function () {
        app.create(data.projectName)
        app.openTalks()
        app.addTalk(data.talk1Name)

        app.settings.open()
        app.settings.addLanguage('Deutsch - German - de')

        const langLabel =
            'Deutsch (de) - You can edit the languages from the Event & Theme page'

        app.votingForm.open()
        app.votingForm.assertVoteItemLength(18, langLabel)
        app.votingForm.addVoteItemWithLang(
            'English name',
            'Test deutsch',
            langLabel
        )
        app.votingForm.save()
        cy.get('#content').scrollTo(0, 500)
        app.votingForm.assertVoteItem(9, 'English name', VOTE_ITEM_TYPES.chip)
        app.votingForm.assertVoteItem(
            9,
            'Test deutsch',
            VOTE_ITEM_TYPES.chip,
            1
        )

        cy.get('#content').scrollTo(0, -500)
        app.votingForm.clickOnAdditionalLangTip()
        app.settings.assertSettingsDisplayed()
    })
})
