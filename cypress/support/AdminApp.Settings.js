export class Settings {
    open() {
        cy.contains('Settings').click()
    }

    addLanguage(lang) {
        cy.get('#languages').type(lang).type('{downarrow}').type('{enter}')
    }
}
