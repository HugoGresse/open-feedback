Cypress.Commands.add('adminLogin', () => {
    const email = Cypress.env('adminUserEmail')
    const pwd = Cypress.env('adminUserPassword')

    cy.visit('/admin')

    cy.get('body').then($body => {
        const button = $body.find('button[data-provider-id=password]')
        if (Cypress.dom.isAttached(button)) {
            button.click()
        }
    })

    // Force wait to let firebase auth finish it's work
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    // Only login if not already logged in
    return cy
        .get('body')
        .then($body => {
            if ($body.find('input[type=email]').length > 0) {
                cy.get('input[type=email]').type(email)
                cy.get('button[type=submit]').click()

                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(1000)
            }

            return cy.get('body')
        })
        .then($body => {
            if ($body.find('input[type=password]').length > 0) {
                cy.get('input[type=password]').type(pwd)
                cy.get('button[type=submit]').click()
            }
        })
})
