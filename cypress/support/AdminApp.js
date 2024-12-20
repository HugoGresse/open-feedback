import { VotingForm } from './AdminApp.VotingForm'
import { Settings } from './AdminApp.Settings'
import { EventTheme } from './AdminApp.EventTheme'
import { Organization } from './AdminApp.Organization'
import { onBeforeLoadChangeNavigatorLanguages } from '../utils/onBeforeLoadChangeNavigatorLanguages.js'

export const VOTE_ITEM_TYPES = {
    chip: 'Chip',
    text: 'Text',
    title: 'Title',
    separator: 'Separator',
}
export class AdminApp {
    votingForm = new VotingForm()
    settings = new Settings()
    eventTheme = new EventTheme()
    organization = new Organization()

    open() {
        cy.visit('/admin', {
            ...onBeforeLoadChangeNavigatorLanguages,
        })
        cy.injectAxe()
    }

    loginIfNeeded() {
        cy.clickOnFakeLoginButtonIfVisible()
    }

    create(projectName, organizationName, checkA11y = false) {
        if (organizationName) {
            cy.contains(organizationName)
                .parents('li')
                .next()
                .contains('Create a new event')
                .click()
        } else {
            cy.contains('Create a new event').click()
        }
        cy.get('input[name=name]').fill(projectName)
        if (checkA11y) {
            cy.checkA11yWithoutFirebaseEmulatorsWarning()
        }
        cy.contains('Continue').click()
        cy.get('input[value=openfeedbackv1]').check()
        if (checkA11y) {
            cy.checkA11yWithoutFirebaseEmulatorsWarning()
        }
        cy.contains('Create event').click()
    }

    openTalks() {
        cy.contains('Talks').click()
    }

    openFeedback() {
        cy.contains('See event').invoke('removeAttr', 'target').click()
        cy.injectAxe()
    }

    addTalk(
        talkName,
        track,
        tag,
        tracksOptions = {},
        tagsOptions = {},
        speakers = []
    ) {
        cy.contains('Add talks').click()
        cy.get('input[name=title]').type(talkName)
        if (track) {
            cy.get('input[id=trackTitle]').type(track)
        }
        const { addFirstAvailableTrack, assertTrackTitle } = tracksOptions
        const { addTagFromAutoComplete } = tagsOptions
        if (addFirstAvailableTrack) {
            cy.get('input[id=trackTitle]').focus().click()
            cy.get('div[role=presentation] #trackTitle-listbox')
                .children()
                .first()
                .click()
        }
        if (assertTrackTitle) {
            cy.get('input[id=trackTitle]').should(
                'have.value',
                assertTrackTitle
            )
        }
        if (tag) {
            cy.get('input[id=tags]').type(tag)
        }
        if (addTagFromAutoComplete) {
            cy.get('input[id=tags]').focus().click()
            cy.contains(addTagFromAutoComplete).click()
        }
        if (speakers.length > 0) {
            for (const speaker of speakers) {
                const { typeForAutoComplete, useFirstFromAutoComplete } =
                    speaker

                if (typeForAutoComplete) {
                    cy.get('input[id=speakers]').type(typeForAutoComplete, {
                        delay: 70,
                    })
                }
                if (useFirstFromAutoComplete) {
                    cy.get('#speakers-listbox').children().first().click()
                }
            }
        }
        cy.get('button[type=submit]').first().click()
    }

    editTalk(talkName, newSpeakersData = []) {
        cy.contains(talkName)
            .parent()
            .parent()
            .get('button[aria-label="edit"]')
            .click()

        for (let i = 0; i < newSpeakersData.length; i++) {
            const speaker = newSpeakersData[i]

            if (newSpeakersData.length > 1 && i === 0) {
                cy.get('input[id=speakers]').type(speaker.name)
                cy.contains('Add a speaker').click()
            }

            cy.get('input[name=name]').type(speaker.name)
            cy.get('.addImage').click()
            cy.get('input[name=photoUrl]').type(speaker.photoUrl, {
                force: true,
            })
            cy.get('#uploadImage').click()

            if (
                newSpeakersData.length > 1 &&
                i !== newSpeakersData.length - 1
            ) {
                cy.get('button[type=submit]').eq(2).click()
            } else {
                cy.contains('Add speaker').click()
            }
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(200)
        }

        cy.contains('Save').click()
    }

    assertTalk(talkName, speakersName = []) {
        cy.contains(talkName).should('be.visible')

        for (const speakerName of speakersName) {
            cy.contains(speakerName).should('be.visible')
        }
    }
}
