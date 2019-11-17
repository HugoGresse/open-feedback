Cypress.Commands.add('visitFeedbackProject', (talkId, option) => {
    const options = option || {}
    const rootUrl = `/${Cypress.env('firestoreTestProjectId')}`
    if (talkId) {
        cy.visit(`${rootUrl}/${talkId}`)
    } else {
        cy.visit(rootUrl)
    }

    if (options.clearUserSession) {
        indexedDB.deleteDatabase('firebaseLocalStorageDb')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)
    }
})

/**
 * Return the vote number of the cell containing the text passed in parameters
 */
Cypress.Commands.add('getVoteCountData', baseEl => {
    cy.contains(baseEl)
        .parent()
        .children()
        .then(childrens => {
            if (childrens.length === 1) {
                return Promise.resolve(0)
            } else {
                return cy
                    .contains(baseEl)
                    .next()
                    .invoke('text')
                    .then(text => {
                        return parseInt(text.split(' ')[0])
                    })
            }
        })
})

let spyConsoleError
Cypress.on('window:before:load', win => {
    spyConsoleError = cy.spy(win.console, 'error').as('consoleError')
})

Cypress.Commands.add('getConsoleError', () => {
    return spyConsoleError
})

afterEach(function() {
    expect(spyConsoleError).to.be.callCount(0)
})
