export class Organization {
    newOrganization(name) {
        cy.contains('New organization').click()
        cy.get('input[name=name]').type(name).type('{enter}')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
    }

    close() {
        cy.contains('Go back to event list').click()
    }

    openVotingForm() {
        cy.get('#tab-1').click()
    }

    assertNewOrgScreen(orgName, users = []) {
        cy.get('h2').should('contain', orgName)
        cy.get('#orgUsers ul').should('have.length', users.length)

        if (users.length === 1) {
            cy.get('#orgUsers ul li')
                .first()
                .contains('Owner')
                .should('have.attr', 'aria-disabled', 'true')
        }
    }

    openUserRoleInfo(userIndex) {
        cy.get('#orgUsers ul li')
            .eq(userIndex)
            .within(() => {
                cy.get(
                    'button[aria-label="Description of organization roles"]'
                ).click()
            })
    }

    closeUserRoleInfo() {
        cy.contains('Back').click()
    }

    assertUserRoleInfo() {
        cy.get('div[role=dialog]').should('contain', 'Admin')
        cy.get('div[role=dialog]').should('contain', 'Owner')
        cy.get('div[role=dialog]').should('contain', 'Editor')
        cy.get('div[role=dialog]').should('contain', 'Viewer')
        cy.get('div[role=dialog] p').should('have.length', 4)
        cy.get('button').should('contain', 'Back').should('be.visible')
    }

    addLanguage(lang) {
        cy.get('#languages').type(lang).type('{downarrow}').type('{enter}')
    }
}
