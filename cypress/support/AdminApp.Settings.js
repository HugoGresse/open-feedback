export class Settings {
    open() {
        cy.contains('Settings').click()
    }

    assertSettingsDisplayed() {
        cy.contains('h5', 'Settings').should('be.visible')
    }

    addLanguage(lang) {
        cy.get('#languages').type(lang).type('{downarrow}').type('{enter}')
    }

    setForceSoloTalkRedirect(shouldBeOn) {
        cy.get('input[name=disableSoloTalkRedirect]').should(
            !shouldBeOn ? 'be.checked' : 'not.be.checked'
        )

        if (shouldBeOn) {
            cy.get('input[name=disableSoloTalkRedirect]').check()
        } else {
            cy.get('input[name=disableSoloTalkRedirect]').uncheck()
        }
    }
}
