describe('Navigate on talk list', function() {
    it('Check talks are loaded & displayed', function() {
        cy.visitTestProject()

        cy.get('h3').should('have.length', 3)
        cy.get('body').should('contain', 'Thursday 27')

        cy.get('h3')
            .first()
            .contains('Amphi 9')
            .next()
            .within(() => {
                cy.get('a')
                    .should(
                        'have.attr',
                        'href',
                        '/xo5qvbJCpYPpU74yGW7W/2019-06-27/1'
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
        cy.get('h2').should('contain', 'The one time story telling#Random')
        cy.url().should('include', '/xo5qvbJCpYPpU74yGW7W')
    })

    it('Check dates changes the displayed talks', function() {
        cy.visitTestProject()

        cy.get('h3').should('have.length', 3)

        cy.contains('Friday 28')
            .should('have.attr', 'href', '/xo5qvbJCpYPpU74yGW7W/2019-06-28')
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
                        '/xo5qvbJCpYPpU74yGW7W/2019-06-28/0'
                    )
                    .should('contain', 'Un talk super bien')
                    .should('contain', 'Pierre')
            })
    })
})
