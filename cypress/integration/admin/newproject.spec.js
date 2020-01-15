import { stringGenerator } from '../../utils/generateString'

describe('Test creating a new project', function() {
    const data = {
        projectName: stringGenerator(),
        talk1Name: 'Talk title 1',
        talk2Name: 'Talk title 2',
        speaker1: {
            name: 'hugo',
            photoUrl: 'https://api.adorable.io/avatars/100/1.png',
        },
        speaker2: {
            name: 'marceau',
            photoUrl: 'https://api.adorable.io/avatars/100/2.png',
        },
        speaker3: {
            name: 'clément',
            photoUrl: 'https://api.adorable.io/avatars/100/3.png',
        },
        track1: 'Amphi',
        track2: 'Salle',
        track3: 'Outside',
        tag1: 'Front',
        tag2: 'Back',
        tag3: 'Infra',
        tag4: 'Design',
    }

    it('New OpenFeedback project', function() {
        cy.adminLogin()

        cy.contains('Create a new event').click()

        cy.get('input[type=text]').type(data.projectName)

        cy.contains('Continue').click()

        cy.get('input[value=openfeedbackv1]').check()

        cy.contains('Create event').click()

        cy.contains(data.projectName)

        // Add a talk without speaker
        cy.contains('Talks').click()
        cy.contains('Add talks').click()
        cy.get('input[name=title]').type(data.talk1Name)
        cy.get('input[id=trackTitle]').type(data.track1)
        cy.get('input[id=tags]').type(data.tag1)
        cy.get('button[type=submit]')
            .first()
            .click()

        // Edit the added talk to add 2 speaker
        cy.contains(data.talk1Name)
            .parent()
            .parent()
            .get('button[aria-label="edit"]')
            .click()
        cy.get('input[id=speakers]').type(data.speaker1.name)
        cy.contains('Add a speaker').click()
        cy.get('input[name=name]').type(data.speaker1.name)
        cy.get('input[name=photoUrl]').type(data.speaker1.photoUrl)
        cy.get('button[type=submit]')
            .eq(2)
            .click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
        cy.get('input[name=name]').type(data.speaker2.name)
        cy.get('input[name=photoUrl]').type(data.speaker2.photoUrl)
        cy.contains('Add speaker').click()
        cy.contains('Save').click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
        cy.contains(data.talk1Name).should('be.visible')
        cy.contains(data.speaker1.name).should('be.visible')
        cy.contains(data.speaker2.name).should('be.visible')
    })
})
