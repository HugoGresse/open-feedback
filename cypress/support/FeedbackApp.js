import { VOTE_ITEM_TYPES } from './AdminApp'

export class FeedbackApp {
    open(talkId, options = {}) {
        const rootUrl = `/${Cypress.env('firestoreTestProjectId')}`
        if (talkId) {
            cy.visit(`${rootUrl}/${talkId}`)
        } else {
            cy.visit(rootUrl)
        }

        cy.injectAxe()

        if (options.clearUserSession) {
            this.clearUserSession()
        }
    }

    openTalkByClick(name) {
        cy.contains(name).click()
        cy.checkA11yWithoutFirebaseEmulatorsWarningAndH1()
    }

    clearUserSession() {
        // New user account without any voted stuffs
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        cy.clearCookies()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)
    }

    assertLogo(expectedLogoUrl, eventName) {
        cy.get(`img[alt="logo ${eventName}"]`).should(
            'have.attr',
            'src',
            expectedLogoUrl
        )
    }

    assertTitle(expectedTitle, shouldBeHidden) {
        if (shouldBeHidden) {
            cy.get(`img[alt="logo ${expectedTitle}"]`)
                .parent()
                .should('not.have.text', expectedTitle)
        } else {
            cy.get('img[alt=logo]').next().contains(expectedTitle)
        }
    }

    assertScheduleLink(expectedLink) {
        cy.get('a[target=_blank]').should('have.attr', 'href', expectedLink)
    }

    assertTracks(expectedCount, names = []) {
        cy.get('h2').should('have.length', expectedCount)
        for (const name of names) {
            cy.get('h2').should('contain', name)
        }
    }

    assertTalks(expectedCount, names = []) {
        cy.get('.talk').should('have.length', expectedCount)
        for (const name of names) {
            cy.get('.talk').should('contain', name)
        }
    }

    assertTalksSearchSuggestions(expectedCount, names = []) {
        cy.get('.talk').should('have.length', expectedCount)
        for (const name of names) {
            cy.get('.talk').should('contain', name)
        }
    }

    assertTalkInList(name) {
        cy.get('#root').should('contain', name)
    }

    search(term) {
        cy.get('input[placeholder=Search]').clear().type(term)
    }

    assertFirstTalkInTrack(trackName, talkUrl, talkTitle, talkSpeaker) {
        cy.get('h2')
            .first()
            .contains(trackName)
            .next()
            .within(() => {
                cy.get('a')
                    .should('have.attr', 'href', talkUrl)
                    .should('contain', talkTitle)
                    .should('contain', talkSpeaker)
            })
    }

    // Within a singular talk

    assertSpeakerInList(name, avatarUrl = null) {
        cy.get('#root').should('contain', name)
        if (avatarUrl) {
            cy.get(`img[alt="Avatar of ${name}"]`).should(
                'have.attr',
                'src',
                avatarUrl
            )
        }
    }

    assertInTalk(talkName, voteItems = []) {
        cy.get('h2').should('contain', talkName)
        for (const voteItemName of voteItems) {
            cy.get('#root').should('contain', voteItemName)
        }
    }

    assertOutsideVoteRange() {
        cy.get('div[data-testid=VoteItem]').eq(0).click()
        const expectedString =
            'Unable to save the vote, the vote period has passed.'
        cy.get('body')
            .contains(expectedString)
            .should('have.text', expectedString)
    }

    assertVoteItem(position, name, type) {
        cy.get('div[data-testid=VoteItem]')
            .eq(position)
            .within(() => {
                switch (type) {
                    case VOTE_ITEM_TYPES.text:
                        cy.contains('h3', name)
                        break
                    case VOTE_ITEM_TYPES.chip:
                        cy.contains('span', name)
                        break
                    default:
                        throw new Error(
                            `${type} not managed in Cypress assertVoteItem`
                        )
                }
            })
    }
}
