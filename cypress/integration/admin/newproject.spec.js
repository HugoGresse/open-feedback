import { stringGenerator } from '../../utils/generateString'
import { AdminApp } from '../../support/AdminApp'
import { FeedbackApp } from '../../support/FeedbackApp'

describe('Test creating a new project', function () {
    const data = {
        projectName: stringGenerator(),
        talk1Name: 'TalkTitle1',
        talk2Name: 'TalkTitle2',
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
        voteItem1: 'ANewVoteItem',
    }

    const app = new AdminApp()
    const feedback = new FeedbackApp()

    beforeEach(() => {
        app.open()
        app.loginIfNeeded()
    })

    it('New OpenFeedback project', function () {
        app.create(data.projectName)
        cy.contains(data.projectName)

        app.openTalks()
        app.addTalk(data.talk1Name, data.track1, data.tag1)

        // -- Edit the added talk to add 2 speakers
        app.editTalk(data.talk1Name, [data.speaker1, data.speaker2])
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
        app.assertTalk(data.talk1Name, [data.speaker1.name, data.speaker2.name])

        // -- Add a new talk with existing stuff
        app.addTalk(
            data.talk2Name,
            null,
            null,
            {
                addFirstAvailableTrack: true,
                assertTrackTitle: data.track1,
            },
            {
                addTagFromAutoComplete: data.tag1,
            },
            [
                {
                    typeForAutoComplete: data.speaker2.name,
                    useFirstFromAutoComplete: true,
                },
            ]
        )

        app.assertTalk(data.talk2Name)
        cy.get(`span:contains(${data.speaker2.name})`).should('have.length', 2)

        app.votingForm.open()
        app.votingForm.assertVoteItemLength(9, 0)
        app.votingForm.addVoteItem(data.voteItem1)
        app.votingForm.save()
        app.votingForm.assertVoteItemLength(10, 0)

        app.openFeedback()
        feedback.assertTalkInList(data.talk1Name)
        feedback.assertTalkInList(data.talk2Name)
        feedback.assertSpeakerInList(data.speaker1.name)
        feedback.assertSpeakerInList(data.speaker2.name)

        feedback.openTalk(data.talk1Name)
        feedback.assertInTalk(data.talk1Name, [data.voteItem1])
    })
})
