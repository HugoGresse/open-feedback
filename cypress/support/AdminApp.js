import { VotingForm } from './AdminApp.VotingForm'
import { Settings } from './AdminApp.Settings'

export const VOTE_ITEM_TYPES = {
    chip: 'Chip',
    text: 'Text',
}
export class AdminApp {
    votingForm = new VotingForm()
    settings = new Settings()

    open() {
        cy.visit('/admin')
    }

    loginIfNeeded() {
        cy.clickOnFakeLoginButtonIfVisible()
    }

    create(projectName) {
        cy.contains('Create a new event').click()
        cy.get('input[name=name]').type(projectName)
        cy.contains('Continue').click()
        cy.get('input[value=openfeedbackv1]').check()
        cy.contains('Create event').click()
    }

    openTalks() {
        cy.contains('Talks').click()
    }

    openFeedback() {
        cy.contains('See event').invoke('removeAttr', 'target').click()
    }

    addTalk(talkName, track, tag) {
        cy.contains('Add talks').click()
        cy.get('input[name=title]').type(talkName)
        if (track) {
            cy.get('input[id=trackTitle]').type(track)
        }
        if (tag) {
            cy.get('input[id=tags]').type(tag)
        }
        cy.get('button[type=submit]').first().click()
    }
}
