import { FeedbackApp } from '../../support/FeedbackApp'

describe('Navigate on talk list', function () {
    const testProjectId = Cypress.env('firestoreTestProjectId')
    const feedback = new FeedbackApp()

    beforeEach(() => {
        feedback.open()
    })

    it('Check talks are loaded & displayed', function () {
        feedback.assertTracks(3)
        feedback.assertTalks(4)

        cy.get('body').should('contain', '27 Thursday')

        feedback.assertFirstTalkInTrack(
            'Amphi 9',
            `/${testProjectId}/2019-06-27/L4lzOeskuLQpmJ4UqxVU`,
            'Vue > React, this is why',
            'Pierre'
        )

        feedback.openTalkByClick('Vue > React, this is why')
        feedback.assertInTalk('Vue > React, this is why#Front')
        cy.url().should('include', `/${testProjectId}`)
    })

    it('Check dates changes the displayed talks + extended search', function () {
        feedback.assertTracks(3)

        cy.contains('28 Friday')
            .should('have.attr', 'href', `/${testProjectId}/2019-06-28`)
            .click()

        feedback.assertTracks(1)
        feedback.assertTalks(1)

        feedback.assertFirstTalkInTrack(
            'Salle 1',
            `/${testProjectId}/2019-06-28/Hv0z6Vqnlk3FsJcx04Hc`,
            'Un talk super bien',
            'Pierre'
        )

        // Extended search should match more talks
        feedback.search('random')
        feedback.assertTalksSearchSuggestions(3, [
            'Why awesome?',
            'The one time story telling',
            'Random talk about React',
        ])
    })

    it('Check filter works', function () {
        // Speaker
        feedback.search('Michel')
        feedback.assertTracks(1)
        feedback.assertTalks(2)

        // Tags
        feedback.search('Front')
        feedback.assertTracks(2)
        feedback.assertTalks(2)
        feedback.assertTalkInList('React')

        // Talk
        feedback.search('Vue > React')

        feedback.assertTracks(1)
        feedback.assertTalks(1)
        feedback.assertTalkInList('Vue > React')
    })
})
