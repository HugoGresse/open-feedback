import { stringGenerator } from '../../utils/generateString'
import { AdminApp } from '../../support/AdminApp'
import { FeedbackApp } from '../../support/FeedbackApp'
import { generateUrl } from '../../utils/generateUrl'
import { DateTime } from 'luxon'

describe('Event and theme options', function () {
    const data = {
        projectName: `event-theme ${stringGenerator()}`,
        talk1Name: 'Ttit1',
        voteItem1: stringGenerator(),
    }

    const app = new AdminApp()
    const feedback = new FeedbackApp()

    beforeEach(() => {
        app.open()
        app.loginIfNeeded()
    })

    it('Edit every field in event & theme', function () {
        app.create(data.projectName)
        app.openTalks()
        app.addTalk(data.talk1Name)

        app.eventTheme.open()

        const newEventName = stringGenerator()

        app.eventTheme.assertEventName(data.projectName)
        app.eventTheme.changeEventName(newEventName)
        app.eventTheme.assertEventName(newEventName)

        app.eventTheme.assertEventNameHidden(false)
        app.eventTheme.setEventNameHidden(true)
        app.eventTheme.assertEventNameHidden(true)

        const scheduleLink = generateUrl()
        app.eventTheme.assertScheduleLink('')
        app.eventTheme.setScheduleLink(scheduleLink)
        app.eventTheme.assertScheduleLink(scheduleLink)

        app.eventTheme.assertVoteRangeRestricted(false)
        app.eventTheme.setVoteRangeRestricted(true)
        app.eventTheme.assertVoteRangeRestricted(true)
        app.eventTheme.editVoteRangeOpenTime(15, 13, 35)
        app.eventTheme.editVoteRangeEndTime(15, 13, 35)

        const imageUrl =
            'https://openfeedback.io/static/logos/openfeedback%20black%20orange-1x.png'
        app.eventTheme.setLogo(imageUrl)
        app.eventTheme.setFavicon(imageUrl)

        app.eventTheme.editChipColors(0)
        app.eventTheme.addChipColors()
        app.eventTheme.addChipColors()
        app.eventTheme.assertChipColorsCounts(3)

        app.eventTheme.save()

        app.openFeedback()

        feedback.openTalk(data.talk1Name)
        feedback.assertLogo(imageUrl)
        feedback.assertTitle(data.projectName, true)
        feedback.assertScheduleLink(scheduleLink)
        feedback.assertOutsideVoteRange()
    })

    it('Assert date formatting and save shortcut', function () {
        app.create(data.projectName)
        app.eventTheme.open()

        const dateTime = DateTime.local()
            .minus({ months: 1 })
            .set({ days: 15, hours: 13, minutes: 35, seconds: 0 })
        app.eventTheme.assertVoteRangeRestricted(false)
        app.eventTheme.setVoteRangeRestricted(true)
        app.eventTheme.editVoteRangeOpenTime(15, 13, 35)

        app.eventTheme.save(true)
        cy.reload()
        app.eventTheme.assertVoteRangeStartTime(dateTime.toFormat('FFF'))
    })
})
