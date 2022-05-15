import { stringGenerator } from '../../utils/generateString'
import { FeedbackApp } from '../../support/FeedbackApp'
import { VOTE_ITEM_TYPES } from '../../support/AdminApp.VotingForm'

describe('Single talk', function () {
    const feedback = new FeedbackApp()
    beforeEach(() => {
        const talkUrl = '2019-06-28/Hv0z6Vqnlk3FsJcx04Hc'
        feedback.open(talkUrl)
    })

    it('Check that detail & vote item are displayed correctly', function () {
        feedback.assertSpeakerInList(
            'Pierre',
            'https://randomuser.me/api/portraits/men/32.jpg'
        )
        feedback.assertInTalk('Un talk super bien', [
            'Trop de code',
            'Super intéressant',
            'Une petite pépite',
        ])
        feedback.assertVoteItem(0, 'Comment', VOTE_ITEM_TYPES.text)

        cy.get('h2')
            .parent()
            .should('contain', 'Friday, June 28')
            .should('contain', '9:00')
            .should('contain', '9:50')
        cy.checkA11yWithoutFirebaseEmulatorsWarning()
    })

    it('Check that boolean vote does work (increment/decrement count)', function () {
        feedback.clearUserSession()

        // to test if this help fixing this random test
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        const voteButtonText = 'Trop de code'

        cy.getVoteCountData(voteButtonText).then((originalVoteCount) => {
            cy.checkA11yWithoutFirebaseEmulatorsWarning()
            cy.contains(voteButtonText).parent().click()

            cy.getVoteCountData(voteButtonText).should((voteCount) => {
                expect(voteCount, 'Vote count incremented').to.equal(
                    originalVoteCount + 1
                )
            })

            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000) // serverless functions runing time wait
            cy.getVoteCountData(voteButtonText).should((voteCount) => {
                expect(voteCount, 'Vote count still incremented').to.equal(
                    originalVoteCount + 1
                )
            })
            cy.contains(voteButtonText).parent().click()

            cy.getVoteCountData(voteButtonText).should((voteCount) => {
                expect(voteCount, 'Vote count decremented').to.equal(
                    originalVoteCount
                )
            })
            cy.checkA11yWithoutFirebaseEmulatorsWarning()
        })
    })

    it('Check that boolean vote does work with multiples votes as the same time as text votes', function () {
        feedback.clearUserSession()

        // to test if this help fixing this random test
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        const voteButtonText = 'Trop de code'

        cy.getVoteCountData(voteButtonText).then((originalVoteCount) => {
            cy.checkA11yWithoutFirebaseEmulatorsWarning()
            cy.contains(voteButtonText).parent().click()

            const inputText = stringGenerator()
            const voteTextAreaSelector = 'textarea[placeholder="Your answer"]'
            cy.get(voteTextAreaSelector).type(inputText)
            cy.contains('Save').click()
            cy.get('.comments').should('contain', inputText)

            cy.getVoteCountData(voteButtonText).should((voteCount) => {
                expect(voteCount, 'Vote count incremented').to.equal(
                    originalVoteCount + 1
                )
            })

            feedback.clearUserSession()
            cy.reload()
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000) // user login anonymous

            // assert data change before reload
            cy.get('.comments').should('contain', inputText)
            cy.getVoteCountData(voteButtonText).should((voteCount) => {
                expect(voteCount, 'Vote count still incremented').to.equal(
                    originalVoteCount + 1
                )
            })

            // new boolean vote
            cy.contains(voteButtonText).parent().click()
            cy.getVoteCountData(voteButtonText).should((voteCount) => {
                expect(voteCount, 'Vote count still incremented').to.equal(
                    originalVoteCount + 2
                )
            })
            // new text up vote
            cy.contains(inputText)
                .parent()
                .parent()
                .get('button')
                .first()
                .click()
            cy.contains(inputText)
                .parent()
                .parent()
                .get('button')
                .should('contain', '2 votes')
        })
    })

    it('Check that text vote does work (post, edit and delete)', function () {
        feedback.clearUserSession()
        cy.checkA11yWithoutFirebaseEmulatorsWarning()
        cy.reload()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000) // user login anonymous

        const inputText = stringGenerator()
        const textEdited = stringGenerator()
        const voteTextAreaSelector = 'textarea[placeholder="Your answer"]'

        cy.get(voteTextAreaSelector).type(inputText)
        cy.contains('Save').click()
        cy.get('.comments').should('contain', inputText)

        cy.get(voteTextAreaSelector).type(textEdited)
        cy.contains('Update').click()
        cy.get('.comments').should('contain', inputText + textEdited)
        cy.get('.comments').should('contain', '1 vote')

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
        cy.contains('Delete').click()
        cy.get('.comments').should('not.contain', inputText + textEdited)
    })
})
