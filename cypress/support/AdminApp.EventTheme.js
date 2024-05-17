export class EventTheme {
    open() {
        cy.contains('Event & Theme').click()
    }

    save(useShortcut = false) {
        if (useShortcut) {
            cy.typeSaveButtons()
        } else {
            cy.contains('Save').click()
        }
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

    // Select a day in the precedent month. Minutes should be % 5
    editVoteRangeOpenTime(
        dayToSelect,
        hour,
        minute,
        selector = 'voteStartTime'
    ) {
        cy.get(`input[name="${selector}"`).click()

        cy.get('div[role=dialog]')
            .parent()
            .contains('button[tabindex=-1]', dayToSelect)
            .click()

        // We force it as the element is not visible (need to scroll) and the scroll don't work...
        cy.get(`li[aria-label="${hour} hours"]`).click({ force: true })
        cy.get(`li[aria-label="${minute} minutes"]`).click({ force: true })
    }

    editVoteRangeEndTime(dayToSelect, hour, minute) {
        this.editVoteRangeOpenTime(dayToSelect, hour, minute, 'voteEndTime')
    }

    assertVoteRangeStartTime(expectedString) {
        cy.get('input[name=voteStartTime]').should('have.value', expectedString)
    }

    assertVoteRangeEndTime(expectedString) {
        cy.get('input[name=voteEndTime]').should('have.value', expectedString)
    }

    setLogo(imageUrl) {
        cy.get('.addImage').first().click()
        cy.get('input[name=logoUrl]').clear().fill(imageUrl)
        cy.get('#uploadImage').click()
    }

    setFavicon(imageUrl) {
        cy.get('.addImage').eq(1).click()
        cy.get('.MuiDrawer-root input[type=file]').selectFile(
            'cypress/fixtures/logo.png',
            { force: true }
        )
        //cy.get('input[name=logoUrl]').clear().fill(imageUrl)
        cy.get('#uploadImage').click()
    }

    addChipColors() {
        cy.get("button[aria-label='Add a new chip color']").click()
    }

    editChipColors(index) {
        cy.get('#chipColors button').eq(index).click()
        cy.get('.hue-horizontal').click(0, 0)
        cy.get('.chrome-picker').click(200, 5)
        cy.contains('Pick').click()
        cy.get('#chipColors button')
            .eq(index)
            .should('have.attr', 'color')
            .and('match', /^f5/)
    }

    assertChipColorsCounts(desiredLength = 0) {
        // the "+" button count for one div
        cy.get('#chipColors button').should('have.length', desiredLength + 1)
    }
}
