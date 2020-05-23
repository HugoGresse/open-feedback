import { enableFetchMocks } from 'jest-fetch-mock'

enableFetchMocks()
import JsonUrlApi from './jsonurl/JsonUrlApi'
import validate from './validation'

const setupApi = (data) => {
    fetch.mockResponseOnce(JSON.stringify(data))
    return new JsonUrlApi({
        jsonUrl: 'point-to-nowhere.json',
    })
}

beforeEach(() => {
    fetch.resetMocks()
})

test('everything is valid', async () => {
    const api = setupApi({
        sessions: {
            '0': {
                title: 'azr',
                description: 'Aze',
                tags: ['tech'],
                speakers: [
                    'lrI6gAvw7EU8fseDc5NfOoYWQJx2',
                    '3jAixvFWDwMpoISHbnkL3IqGNjP2',
                ],
                id: 0,
                trackTitle: 'Zenika Nantes',
            },
        },
        speakers: {
            lrI6gAvw7EU8fseDc5NfOoYWQJx2: {
                company: 'Comp',
                name: 'MyName',
                photoUrl:
                    'https://lh3.googleusercontent.com/-CmFqCYA4cBc/AAAAAAAAAAI/AAAAAAAAABw/MG-IwRWRmyM/photo.jpg',
                socials: [],
                id: 'lrI6gAvw7EU8fseDc5NfOoYWQJx2',
            },
            '3jAixvFWDwMpoISHbnkL3IqGNjP2': {
                company: 'Comp2',
                name: 'MySecondName',
                photoUrl:
                    'https://lh3.googleusercontent.com/-1klXL98Tgmo/AAAAAAAAAAI/AAAAAAAAAI4/2MgtgWfi9Zw/photo.jpg',
                socials: [],
                id: '3jAixvFWDwMpoISHbnkL3IqGNjP2',
            },
        },
    })

    const result = await validate(api)
    expect(fetch.mock.calls.length).toEqual(1)
    expect(result).toEqual({
        dataAvailable: true,
        isSuccessful: true,
        speaker: {
            idValid: true,
            nameValid: true,
            photoUrlValid: true,
            speakerCount: 2,
        },
        speakersObjectFound: true,
        talk: {
            idValid: true,
            noSpeakers: 0,
            speakersMissing: 0,
            speakersValid: true,
            startEndTimeValid: true,
            talkCount: 1,
            titleValid: true,
            trackTitleValid: true,
            tagsValid: true,
        },
        talksObjectFound: true,
    })
})

test('only required attributes supplied', async () => {
    const api = setupApi({
        sessions: {
            '0': {
                title: 'azr',
                id: 0,
            },
        },
        speakers: {},
    })

    const result = await validate(api)
    expect(fetch.mock.calls.length).toEqual(1)
    expect(result).toEqual({
        dataAvailable: true,
        isSuccessful: true,
        speaker: {
            idValid: true,
            nameValid: true,
            photoUrlValid: true,
            speakerCount: 0,
        },
        speakersObjectFound: true,
        talk: {
            idValid: true,
            noSpeakers: 0,
            speakersMissing: 0,
            speakersValid: true,
            startEndTimeValid: true,
            talkCount: 1,
            titleValid: true,
            trackTitleValid: true,
            tagsValid: true,
        },
        talksObjectFound: true,
    })
})

test('some speakers are missing, some photo url not formatted correctly', async () => {
    const api = setupApi({
        sessions: {
            '0': {
                title: 'azr',
                description: 'Aze',
                tags: ['tech'],
                speakers: [
                    'lrI6gAvw7EU8fseDc5NfOoYWQJx2',
                    '3jAixvFWDwMpoISHbnkL3IqGNjP2',
                ],
                id: 0,
                trackTitle: 'Zenika Nantes',
            },
            '1': {
                title: 'qsd',
                description: 'qsf',
                tags: ['secu'],
                speakers: ['JbUUOvPC3BQPandvs31ufemPpPQ2'],
                id: 1,
                startTime: '2019-09-27T18:00:00+02:00',
                endTime: '2019-09-27T18:00:00+02:00',
                trackTitle: 'Zenika Nantes',
            },
        },
        speakers: {
            lrI6gAvw7EU8fseDc5NfOoYWQJx2: {
                company: 'Comp',
                name: 'MyName',
                photoUrl: 'photo.jpg',
                socials: [],
                id: 'lrI6gAvw7EU8fseDc5NfOoYWQJx2',
            },
        },
    })

    const result = await validate(api)
    expect(fetch.mock.calls.length).toEqual(1)
    expect(result).toEqual({
        dataAvailable: true,
        isSuccessful: false,
        speaker: {
            idValid: true,
            nameValid: true,
            photoUrlValid: false,
            speakerCount: 1,
        },
        speakersObjectFound: true,
        talk: {
            idValid: true,
            noSpeakers: 0,
            speakersMissing: 2,
            speakersValid: true,
            startEndTimeValid: true,
            talkCount: 2,
            titleValid: true,
            trackTitleValid: true,
            tagsValid: true,
        },
        talksObjectFound: true,
    })
})

test('malformated date & tags', async () => {
    const api = setupApi({
        sessions: {
            '0': {
                title: 'azr',
                id: 0,
                tags: 'should be an array',
                startTime: 'zzzzzzzzzzz',
                endTime: '2019-09-27T18:00:00+02:00',
            },
        },
        speakers: {},
    })

    const result = await validate(api)
    expect(fetch.mock.calls.length).toEqual(1)
    expect(result).toEqual({
        dataAvailable: true,
        isSuccessful: false,
        speaker: {
            idValid: true,
            nameValid: true,
            photoUrlValid: true,
            speakerCount: 0,
        },
        speakersObjectFound: true,
        talk: {
            idValid: true,
            noSpeakers: 0,
            speakersMissing: 0,
            speakersValid: true,
            startEndTimeValid: false,
            talkCount: 1,
            titleValid: true,
            trackTitleValid: true,
            tagsValid: false,
        },
        talksObjectFound: true,
    })
})
