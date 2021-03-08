export class Organization {
    open(OrganizationId) {
        cy.contains('Settings').click()
    }

    assertSettingsDisplayed() {
        cy.contains('h5', 'Settings').should('be.visible')
    }

    addLanguage(lang) {
        cy.get('#languages').type(lang).type('{downarrow}').type('{enter}')
    }
}
