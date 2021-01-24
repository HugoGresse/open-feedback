export class EventTheme {
    open() {
        cy.contains('Event & Theme').click()
    }

    save() {
        cy.contains('Save').click()
    }

    assertEventName(shouldBe) {
        cy.get('input[name=name]').should('have.value', shouldBe)
    }

    changeEventName(newName) {
        cy.get('input[name=name]').clear().fill(newName)
    }

    assertEventNameHidden(shouldBeChecked) {
        cy.get('input[name=hideEventName]').should(
            shouldBeChecked ? 'be.checked' : 'not.be.checked'
        )
    }

    setEventNameHidden(shouldBeHidden) {
        if (shouldBeHidden) {
            cy.get('input[name=hideEventName]').check()
        } else {
            cy.get('input[name=hideEventName]').uncheck()
        }
    }

    assertScheduleLink(expectedValue) {
        cy.get('input[name=scheduleLink]').should('have.value', expectedValue)
    }

    setScheduleLink(link) {
        cy.get('input[name=scheduleLink]').clear().fill(link)
    }

    assertVoteRangeRestricted(shouldBeChecked) {
        cy.get('input[name=restrictVoteRange]').should(
            shouldBeChecked ? 'be.checked' : 'not.be.checked'
        )
    }

    setVoteRangeRestricted(isRestricted) {
        if (isRestricted) {
            cy.get('input[name=restrictVoteRange]').check()
        } else {
            cy.get('input[name=restrictVoteRange]').uncheck()
        }
    }

    // Take care to have unique value, with two numbers. Minutes should be % 5
    editVoteRangeOpenTime(
        dayToSelect,
        hour,
        minute,
        selector = 'voteStartTime'
    ) {
        cy.get(`input[name="${selector}"`).click()
        cy.get('*[class^="MuiPickersCalendar-week-"]')
            .parent()
            .contains('p', dayToSelect)
            .click()

        cy.get('*[class^="MuiPickersClock-clock-"]')
            .contains(hour)
            .then((el) => {
                const rect = el[0].getBoundingClientRect()
                cy.get('body').click(rect.x + 10, rect.y + 10)
            })
        cy.get('*[class^="MuiPickersClock-clock-"]')
            .contains(minute)
            .then((el) => {
                const rect = el[0].getBoundingClientRect()
                cy.get('body').click(rect.x + 10, rect.y + 10)
            })
    }
    editVoteRangeEndTime(dayToSelect, hour, minute) {
        this.editVoteRangeOpenTime(dayToSelect, hour, minute, 'voteEndTime')
    }

    setLogo(imageUrl) {
        cy.get('.addImage').first().click()
        // cy.fixture('logo.png').as('logo')
        // Firebase storage emulators not available yet (jan 15 2021)
        // cy.get('input[type=file]').then(function(el) {
        //     cy.uploadImage(this.logo, 'logo.png', el)
        // })
        cy.get('input[name=logoUrl]').clear().fill(imageUrl)
        cy.get('#uploadImage').click()
    }

    setFavicon(imageUrl) {
        cy.get('.addImage').eq(1).click()
        cy.get('input[name=faviconUrl]').clear().fill(imageUrl)
        cy.get('#uploadImage').click()
    }

    addChipColors() {
        cy.get("div[aria-label='new chip color']").click()
    }

    editChipColors(index) {
        cy.get('#chipColors div').eq(index).click()
        cy.get('.hue-horizontal').click(0, 0)
        cy.get('.chrome-picker').click(200, 5)
        cy.contains('Pick').click()
        cy.get('#chipColors div')
            .eq(index)
            .should('have.attr', 'color')
            .and('match', /^f6/)
    }

    assertChipColorsCounts(desiredLength = 0) {
        // the "+" button count for one div
        cy.get('#chipColors div').should('have.length', desiredLength + 1)
    }
}
