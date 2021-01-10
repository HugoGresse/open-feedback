describe('Navigate on talk list', function () {
    const testProjectId = Cypress.env('firestoreTestProjectId')

    it('Check talks are loaded & displayed', function () {
        cy.visitFeedbackProject()

        cy.get('h3').should('have.length', 3)
        cy.get('body').should('contain', '27 Thursday')

        cy.get('h3')
            .first()
            .contains('Amphi 9')
            .next()
            .within(() => {
                cy.get('a')
                    .should(
                        'have.attr',
                        'href',
                        `/${testProjectId}/2019-06-27/L4lzOeskuLQpmJ4UqxVU`
                    )
                    .should('contain', 'Vue > React, this is why')
                    .should('contain', 'Pierre')
            })

        cy.get('h3')
            .first()
            .next()
            .within(() => {
                cy.get('a').click()
            })
        cy.get('h2').should('contain', 'Vue > React, this is why#Front')
        cy.url().should('include', `/${testProjectId}`)
    })

    it('Check dates changes the displayed talks + extended search', function () {
        cy.visitFeedbackProject()

        cy.get('h3').should('have.length', 3)

        cy.contains('28 Friday')
            .should('have.attr', 'href', `/${testProjectId}/2019-06-28`)
            .click()

        cy.get('h3').should('have.length', 1)

        cy.get('h3')
            .first()
            .contains('Salle 1')
            .next()
            .within(() => {
                cy.get('a')
                    .should(
                        'have.attr',
                        'href',
                        `/${testProjectId}/2019-06-28/Hv0z6Vqnlk3FsJcx04Hc`
                    )
                    .should('contain', 'Un talk super bien')
                    .should('contain', 'Pierre')
            })

        // Extended search should match more talks
        cy.get('input[placeholder=Search]').type('random')
        cy.get('.talk')
            .should('have.length', 3)
            .should('contain', 'Why awesome?')
            .should('contain', 'The one time story telling')
            .should('contain', 'Random talk about React')
    })

    it('Check filter works', function () {
        cy.visitFeedbackProject()

        // Speaker
        cy.get('input[placeholder=Search]').type('Michel')
        cy.get('.talk').should('have.length', 2)

        // Tags
        cy.get('input[placeholder=Search]').clear().type('Front')
        cy.get('.talk').should('have.length', 2).should('contain', 'React')

        // Talk
        cy.get('input[placeholder=Search]').clear().type('Vue > React')
        cy.get('.talk')
            .should('have.length', 1)
            .should('contain', 'Vue > React')
    })
})
