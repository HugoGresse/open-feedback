export const VOTE_ITEM_TYPES = {
    chip: 'Chip',
    text: 'Text',
}

export class VotingForm {
    open() {
        cy.contains('Voting Form').click()
    }

    save(doubleConfirm, useShortcut) {
        if (useShortcut) {
            cy.typeSaveButtons()
        } else {
            cy.contains('Save').click()
        }

        if (doubleConfirm) {
            cy.get('.MuiSnackbarContent-message').should(
                'contain',
                'Vote type changed'
            )
            cy.get('div[role=presentation]').contains('Save').click()
        }
        cy.get('.MuiSnackbarContent-message').should(
            'contain',
            'Voting form saved'
        )
    }

    assertVoteItemLength(requiredLength, additionalLang, langCountHalf = true) {
        // For some reason, the length of the div for the lang is not the same between organization and event voting form
        cy.get('li[data-testid=VoteItem] input[type=text]').should(
            'have.length',
            requiredLength
        )
        if (additionalLang) {
            cy.get(`div[aria-label="${additionalLang}"`).should(
                'have.length',
                langCountHalf ? requiredLength / 2 : requiredLength
            )
        }
    }

    assertVoteItem(position, name, type, inputPos = 0) {
        cy.get('li[data-testid=VoteItem]')
            .eq(position)
            .then(($element) => {
                cy.wrap($element).should('contain', type)
                cy.wrap($element).within(() => {
                    cy.get('input[type=text]')
                        .eq(inputPos)
                        .should('have.value', name)
                })
            })
    }

    addVoteItem(name) {
        cy.contains('New item').click()
        cy.get('input[type=text]').last().type(name)
    }

    addVoteItemWithLang(nameDefault, nameInLang, lang) {
        cy.contains('New item').click()
        cy.get(`div[aria-label="${lang}"]`)
            .last()
            .parent()
            .within(() => {
                cy.get('input[type=text]').last().type(nameInLang)
                cy.get('input[type=text]')
                    .last()
                    .parent()
                    .prev()
                    .within(() => {
                        cy.get('input').type(nameDefault)
                    })
            })
    }

    removeVoteItem(position) {
        cy.get('li[data-testid=VoteItem]')
            .eq(position)
            .within(() => {
                cy.get(`button[aria-label=delete]`).click()
            })
    }

    moveVoteItem(itemToMove, toBelow) {
        const label = toBelow ? 'move down' : 'move up'
        cy.get('li[data-testid=VoteItem]')
            .eq(itemToMove)
            .within(() => {
                cy.get(`button[aria-label="${label}"]`).click()
            })
    }

    changeVoteItemType(position, from, to) {
        cy.get('li[data-testid=VoteItem]').eq(position).contains(from).click()

        cy.contains('ul[role=listbox] li', to).click()
    }

    reset() {
        cy.contains('Reset').click()
        cy.get('body').should('contain', 'Are you sure to reset')
        cy.get('div[role=presentation]').contains('Reset').click()
    }

    clickOnAdditionalLangTip() {
        cy.contains('p a', 'Settings').click()
    }
}
