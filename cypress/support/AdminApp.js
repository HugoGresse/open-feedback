export const VOTE_ITEM_TYPES = {
    chip: 'Chip',
    text: 'Text',
}
export class AdminApp {
    open() {
        cy.visit('/admin')
    }

    loginIfNeeded() {
        cy.clickOnFakeLoginButtonIfVisible()
    }

    create(projectName) {
        cy.contains('Create a new event').click()
        cy.get('input[name=name]').type(projectName)
        cy.contains('Continue').click()
        cy.get('input[value=openfeedbackv1]').check()
        cy.contains('Create event').click()
    }

    openTalks() {
        cy.contains('Talks').click()
    }

    openFeedback() {
        cy.contains('See event').invoke('removeAttr', 'target').click()
    }

    addTalk(talkName, track, tag) {
        cy.contains('Add talks').click()
        cy.get('input[name=title]').type(talkName)
        if (track) {
            cy.get('input[id=trackTitle]').type(track)
        }
        if (tag) {
            cy.get('input[id=tags]').type(tag)
        }
        cy.get('button[type=submit]').first().click()
    }

    openVotingForm() {
        cy.contains('Voting Form').click()
    }

    saveVotingForm(doubleConfirm) {
        cy.contains('Save').click()
        if (doubleConfirm) {
            cy.get('body').should('contain', 'Vote type changed')
            cy.get('div[role=presentation]').contains('Save').click()
        }
        cy.get('body').should('contain', 'Voting form saved')
    }

    assertVoteItemLength(requiredLength) {
        cy.get('input[type=text]').should('have.length', requiredLength)
    }

    assertVoteItem(position, name, type) {
        cy.get('div[data-testid=VoteItem]')
            .eq(position)
            .then(($element) => {
                cy.wrap($element).should('contain', type)
                cy.wrap($element).within(() =>
                    cy.get('input[type=text]').should('have.value', name)
                )
            })
    }

    addVoteItem(name) {
        cy.contains('New item').click()
        cy.get('input[type=text]').last().type(name)
    }

    moveVoteItem(itemToMove, toBelow) {
        const label = toBelow ? 'move down' : 'move up'
        cy.get('div[data-testid=VoteItem]')
            .eq(itemToMove)
            .within(() => {
                cy.get(`button[aria-label="${label}"]`).click()
            })
    }

    changeVoteItemType(position, from, to) {
        cy.get('div[data-testid=VoteItem]').eq(position).contains(from).click()

        cy.contains('ul li', to).click()
    }
}
