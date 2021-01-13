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

    before(() => {
        app.open()
        app.loginIfNeeded()
    })

    it('Add vote item, change type, re-order, delete some', function () {
        app.create(data.projectName)
        app.openTalks()
        app.addTalk(data.talk1Name)

        app.openVotingForm()

        app.assertVoteItemLength(9)
        app.addVoteItem(data.voteItem1)
        app.assertVoteItemLength(10)
        app.assertVoteItem(0, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        app.moveVoteItem(0, true)
        app.assertVoteItem(0, "I've learned a lot 🤓", VOTE_ITEM_TYPES.chip)
        app.assertVoteItem(1, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        app.changeVoteItemType(0, VOTE_ITEM_TYPES.chip, VOTE_ITEM_TYPES.text)

        app.saveVotingForm(true)

        app.openFeedback()

        feedback.openTalk(data.talk1Name)
        feedback.assertVoteItem(
            0,
            "I've learned a lot 🤓",
            VOTE_ITEM_TYPES.text
        )
        feedback.assertVoteItem(1, 'Fun 😃', VOTE_ITEM_TYPES.chip)
        feedback.assertVoteItem(9, data.voteItem1, VOTE_ITEM_TYPES.chip)
    })
})
