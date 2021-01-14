export const VOTE_ITEM_TYPES = {
    chip: 'Chip',
    text: 'Text',
}
export class VotingForm {
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

    removeVoteItem(position) {
        cy.get('div[data-testid=VoteItem]')
            .eq(position)
            .within(() => {
                cy.get(`button[aria-label=delete]`).click()
            })
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

    reset() {
        cy.contains('Reset').click()
        cy.get('body').should('contain', 'Are you sure to reset')
        cy.get('div[role=presentation]').contains('Reset').click()
    }
}
