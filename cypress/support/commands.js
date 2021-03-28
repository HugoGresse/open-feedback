const { triggerSaveKeypress } = require('../utils/triggerSaveKeyPress')

Cypress.Commands.add('checkA11yWithoutFirebaseEmulatorsWarning', () => {
    // Firebase emulators add a message the the bottom of the screen containing:
    // "Running in emulator mode. Do not use with production credentials."
    // which does not appear in production, we discoard this for Axe run confis

    // .MuiButtonBase-root is because white text on blue or orange background is
    // computed hs having the wrong ratio but is usually better
    // source https://uxmovement.com/buttons/the-myths-of-color-contrast-accessibility/
    cy.checkA11y({
        exclude: [['.firebase-emulator-warning'], ['.MuiButtonBase-root']],
    })
})

/**
 * Return the vote number of the cell containing the text passed in parameters
 */
Cypress.Commands.add('getVoteCountData', (baseEl) => {
    cy.get(`div[aria-label="${baseEl}"] button`)
        .children()
        .then((childrens) => {
            if (childrens.length === 1) {
                return Promise.resolve(0)
            } else {
                return cy
                    .get(`div[aria-label="${baseEl}"] span:nth-child(2)`)
                    .invoke('text')
                    .then((text) => {
                        return parseInt(text.split(' ')[0])
                    })
            }
        })
})

// Fill an input at once, usage: cy.get(...).fill("text")
// From https://github.com/cypress-io/cypress/issues/566#issuecomment-605355300
Cypress.Commands.add(
    'fill',
    {
        prevSubject: 'element',
    },
    ($subject, value) => {
        const el = $subject[0]
        el.value = value
        return cy.wrap($subject).type('t{backspace}')
    }
)

Cypress.Commands.add('uploadImage', (image, imagePath, el) => {
    // convert the logo base64 string to a blob
    const blob = Cypress.Blob.base64StringToBlob(image, 'image/png')

    const file = new File([blob], imagePath, { type: 'image/png' })
    const list = new DataTransfer()

    list.items.add(file)
    const myFileList = list.files

    el[0].files = myFileList
    el[0].dispatchEvent(new Event('change', { bubbles: true }))
    console.log('Image upload set!')
})

Cypress.Commands.add('typeSaveButtons', () => {
    cy.document().then((doc) => {
        triggerSaveKeypress(doc)
    })
})

Cypress.on('uncaught:exception', (err, runnable) => {
    if (
        err.message.includes(
            'Could not find the FirebaseUI widget element on the page.'
        )
    ) {
        return false // Do not fail on this stupid not error
    }

    // using mocha's async done callback to finish
    // this test so we prove that an uncaught exception
    // was thrown
    // done()

    // return false to prevent the error from
    // failing this test
    return true
})

/**
 * Click to an email pwd account
 */
Cypress.Commands.add('clickOnFakeLoginButtonIfVisible', () => {
    cy.getCookie('isLoggedIn').then((isLoggedIn) => {
        console.log('cookie', isLoggedIn)
        cy.log('isLoggedIn? ' + JSON.stringify(isLoggedIn))
        if (!isLoggedIn || isLoggedIn.value !== 'true') {
            cy.contains('Fake login with EMAIL').click()
        }
    })
})

let spyConsoleError
Cypress.on('window:before:load', (win) => {
    spyConsoleError = cy.spy(win.console, 'error').as('consoleError')
})

Cypress.Commands.add('getConsoleError', () => {
    return spyConsoleError
})

afterEach(function () {
    if (spyConsoleError) {
        // expect(spyConsoleError).to.be.callCount(0)
    }
})
