import { stringGenerator } from '../../utils/generateString'
import firebase from 'firebase/app'
import 'firebase/auth'

firebase.initializeApp({
    apiKey: Cypress.env('REACT_APP_API_KEY'),
    authDomain: Cypress.env('REACT_APP_AUTH_DOMAIN'),
    databaseURL: Cypress.env('REACT_APP_DATABASE_URL'),
    projectId: Cypress.env('REACT_APP_PROJECT_ID'),
    storageBucket: Cypress.env('REACT_APP_STORAGE_BUCKET'),
    appId: Cypress.env('REACT_APP_APPID'),
})

describe('Test creating a new project', function () {
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
        voteItem1: 'This is just a simple boring test',
    }

    beforeEach(function () {
        const email = Cypress.env('adminUserEmail')
        const pwd = Cypress.env('adminUserPassword')
    })

    it('New OpenFeedback project', function () {
        cy.visit('/admin')
        cy.clickOnFakeLoginButton()

        cy.contains('Create a new event').click()
        cy.get('input[name=name]').type(data.projectName)
        cy.contains('Continue').click()
        cy.get('input[value=openfeedbackv1]').check()
        cy.contains('Create event').click()
        // After redirect
        cy.contains(data.projectName)

        // -- Add a talk without speaker
        cy.contains('Talks').click()
        cy.contains('Add talks').click()
        cy.get('input[name=title]').type(data.talk1Name)
        cy.get('input[id=trackTitle]').type(data.track1)
        cy.get('input[id=tags]').type(data.tag1)
        cy.get('button[type=submit]').first().click()

        // -- Edit the added talk to add 2 speaker
        cy.contains(data.talk1Name)
            .parent()
            .parent()
            .get('button[aria-label="edit"]')
            .click()
        cy.get('input[id=speakers]').type(data.speaker1.name)
        cy.contains('Add a speaker').click()
        cy.get('input[name=name]').type(data.speaker1.name)
        cy.get('.addImage').click()
        cy.get('input[name=photoUrl]').type(data.speaker1.photoUrl, {
            force: true,
        })
        cy.get('#uploadImage').click()
        cy.get('button[type=submit]').eq(2).click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
        cy.get('input[name=name]').type(data.speaker2.name)
        cy.get('.addImage').click()
        cy.get('input[name=photoUrl]').type(data.speaker2.photoUrl, {
            force: true,
        })
        cy.get('#uploadImage').click()
        cy.contains('Add speaker').click()
        cy.contains('Save').click()
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
        cy.contains(data.talk1Name).should('be.visible')
        cy.contains(data.speaker1.name).should('be.visible')
        cy.contains(data.speaker2.name).should('be.visible')

        // -- Add a new talk with existing stuff
        cy.contains('Add talks').click()
        cy.get('input[name=title]').type(data.talk2Name)
        cy.get('input[id=trackTitle]').focus().click()
        cy.get('#trackTitle-popup').children().first().click()
        cy.get('input[id=trackTitle]').should('have.value', data.track1)
        cy.get('input[id=tags]').focus().click()
        cy.contains(data.tag1).click()
        cy.get('input[id=speakers]').type(data.speaker2.name, { delay: 70 })
        cy.get('#speakers-popup').children().first().click()
        cy.get('button[type=submit]').first().click()
        cy.contains(data.talk2Name).should('be.visible')
        cy.get(`span:contains(${data.speaker2.name})`).should('have.length', 2)

        // -- Add a vote item
        cy.contains('Voting Form').click()
        cy.get('input[type=text]').should('have.length', 9)
        cy.contains('New item').click()
        cy.get('input[type=text]').last().type(data.voteItem1)
        cy.contains('Save').click()
        cy.get('input[type=text]').should('have.length', 10)

        // Go to the event and to the first added talk
        cy.contains('See event').invoke('removeAttr', 'target').click()

        cy.get('#root').should('contain', data.talk1Name)
        cy.get('#root').should('contain', data.speaker1.name)
        cy.get('#root').should('contain', data.talk2Name)
        cy.get('#root').should('contain', data.speaker2.name)

        cy.contains(data.talk1Name).click()

        cy.get('h2').should('contain', data.talk1Name)
        cy.get('#root').should('contain', data.voteItem1)
    })
})
