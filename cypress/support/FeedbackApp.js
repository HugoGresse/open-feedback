import { VOTE_ITEM_TYPES } from './AdminApp'

export class FeedbackApp {
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
                .next()
                .should('not.have.text', expectedTitle)
        } else {
            cy.get('img[alt=logo]').next().contains(expectedTitle)
        }
    }

    assertScheduleLink(expectedLink) {
        cy.get('a[target=_blank]').should('have.attr', 'href', expectedLink)
    }

    openTalk(name) {
        cy.contains(name).click()
    }

    assertTalkInList(name) {
        cy.get('#root').should('contain', name)
    }

    assertSpeakerInList(name) {
        cy.get('#root').should('contain', name)
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
