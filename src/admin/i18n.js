import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'

i18n.use(LanguageDetector).init({
    // we init with resources
    resources: {
        en: {
            translations: {
                common: {
                    save: 'Save',
                    cancel: 'Cancel',
                    back: 'Back',
                    copy: 'Copy',
                },
                root: {
                    title: 'Your OpenFeedback events',
                    userNotVerified: 'User not verified',
                },
                auth: {
                    emailNotVerified:
                        'You need to verify your email using the link you&apos;ve received in your inbox.',
                    retry: 'Retry',
                },
                baseComponents: {
                    search: 'Search',
                },
                dashboard: {
                    noVotes: 'No votes yet',
                    highlights: 'Highlights',
                    totalVoters: 'Total Voters',
                    votes: 'Votes',
                    comments: 'Comments',
                    votesPerUser: 'Votes per user',
                    commentsPerUser: 'Comments per user',
                    mostVoted: 'Most voted',
                    votesPerHour: 'Votes per hour',
                },
                layout: {
                    seeEvent: 'See event',
                    '404':
                        'The requested URL {{pathname}} was not found on this server.',
                    sidebar: {
                        data: 'DATA',
                        settings: 'SETTINGS',
                    },
                },
                newEvent: {
                    step1: {
                        title: 'Create a new event (step 1/3)',
                        name: "What's your event name?",
                        nameRequired: 'The event name is required',
                        fieldName: 'Event name',
                        submit: 'Continue',
                    },
                    step2: {
                        stepTitle: 'Create a new event (step 2/3)',
                        title: 'How do you want to load your data?',
                        projectTypeRequired:
                            'You need to choose how you want to setup the project.',
                        projectTypeOpenfeedback:
                            'OpenFeedback Database (default)',
                        projectTypeOpenfeedbackDetail:
                            'You can manually enter the talks/speakers/schedule on OpenFeedback. It will not be in sync with another service if you are using one. No additional configuration is required.',
                        projectTypeHoverboard: 'Hoverboard v2 Firestore',
                        projectTypeHoverboardDetail:
                            'The talks/speakers/schedule will be retrieved directly on page load from your own Firestore database that follow Hoverboard v2 model.',
                        projectTypeJsonurl: 'JSON link (ex: your API)',
                        projectTypeJsonurlDetail:
                            ' By providing a url to a .json that you’ll either host (on gist.github.com or another static server) or a dynamic answer from your own database/api. The json model will need to match OpenFeedback one, you’ll be able to check it on the next screen.',
                        back: 'Back',
                        create: 'Create event',
                        continue: 'Continue',
                    },
                    step3: {
                        notManaged:
                            'This project type is not managed, this should not happen, either your not a good dev, or ¯\\_(ツ)_/¯',
                        stepTitle: 'Create a new event (step 3/3)',
                        submit: 'Create event',
                        back: 'Back',
                        validation: 'Validation',
                        firebaseCredentials: 'Enter your Firebase credentials',
                        jsonurl: "What's the url of the json?",
                    },
                },
                settingsEvent: {
                    chooseColor: 'Choose the color',
                    delete: 'Delete',
                    cancel: 'Cancel',
                    pick: 'Pick',
                    fieldNameRequired: 'The project name is required',
                    fieldScheduleNotValid:
                        'The schedule link is not a valid url',
                    fieldLogoUrlNotValid: 'The logo is not a valid url',
                    fieldLogoUrlRequired: 'The logo is required',
                    fieldFaviconUrlNotValid: 'The favicon is not a valid url',
                    fieldFaviconUrlRequired: 'The favicon is required',
                    fieldName: 'Name',
                    fieldSchedule: 'Schedule link',
                    fieldVoteRange: 'Restrict vote open/close time',
                    fieldVoteOpen: 'Vote open time (in your local timezone)',
                    fieldVoteClose: 'Vote end time (in your local timezone)',
                    fieldLogoUrl: 'Logo url (around 100*100px)',
                    fieldFaviconUrl: 'Favicon url (.png or .ico)',
                    fieldChipColors: 'Chip Colors',
                    save: 'Save',
                    error:
                        ' You have some error in here, would you mind fixing it before saving? Much appreciated.',
                },
                settingsSetup: {
                    config: 'Configuration',
                    validation: 'Validation',
                    setupMode: 'Setup Mode',
                    cannotChange:
                        'You cannot change the setup mode after creating the project.',
                    validateConfig: 'VALIDATE CONFIG',
                    hoverboard: {
                        projectIdRequired:
                            'The Firebase project ID is required',
                        apiKeyRequired: 'The API Key is required',
                        dbUrlValid: 'The database URL must be a valid url',
                        dbUrlRequired: 'The database URL is required',
                    },
                    json: {
                        jsonUrlValid: 'The JSON URL must be a valid url',
                        jsonUrlRequired: 'The JSON URL must be a valid url',
                        fieldJsonUrl: 'JSON URL',
                        showJsonModel: 'Show JSON model',
                    },
                },
                settingsUser: {
                    invite: {
                        emailSent: 'sent',
                        error: 'errored',
                        new: 'created',
                        default: 'has disappeared',
                    },
                    invitation: 'Invitation',
                    on: 'on',
                    status: 'Invitation to become Member',
                    invites: 'PENDING INVITES',
                    add: 'Add a new member to the event',
                    addButton: 'Add a member',
                    emailNotValid:
                        'The member email must be a valid email, you bitch!',
                    emailRequired:
                        'The member email is required. You think you can invite Nobody? Well... no.',
                    memberEmail: 'Member email',
                    submit: 'Add member',
                    owner: 'Owner',
                    member: 'Member',
                },
                settingsVotingForm: {
                    title: 'Vote items',
                    new: 'New item',
                    options: 'Options',
                    enableComment: 'Enable comment',
                },
                speakers: {
                    addTitle: 'Add a new speaker to the event',
                    nameRequired: 'The speaker name is required.',
                    photoRequired: 'The speaker photo url is required.',
                    photoValid: 'The photo url is not a valid url.',
                    socialValid: 'The social url is not a valid url.',
                    name: 'Name*',
                    photoUrl: 'Photo url*',
                    social: 'Social profil page',
                    submit: 'Add speaker',
                    submitContinue: 'Add speaker & continue',
                    cannotChange:
                        'Speakers cannot be changed from OpenFeedback itself for this project. Refer to your external services configuration to do so.',
                    addButton: 'Add speaker',
                },
                talks: {
                    titleAdd: 'Add a new talk to the event',
                    titleEdit: 'Edit a talk',
                    fieldTitleRequired: '',
                    fieldStartTimeRequired: '',
                    fieldEndTimeRequired: '',
                    fieldTitle: 'Title*',
                    fieldStartTime: 'Start time*',
                    fieldEndTime: 'End time*',
                    fieldTrack: 'Track title',
                    fieldTags: 'Tags',
                    fieldSpeakers: 'Speaker(s)',
                    submit: 'Add talk',
                    submitContinue: 'Add talk & continue',
                    cannotChange:
                        'Talks cannot be changed from OpenFeedback itself for this project. Refer to your external services configuration to do so.',
                    addTalks: 'Add talks',
                    speakerMissing:
                        'This speaker is missing from the data, probably deleted',
                },
            },
        },
        fr: {
            translations: {
                root: {
                    title: 'Vos évènements OpenFeedback',
                    userNotVerified: 'Utilisateur non vérifé',
                },
            },
        },
    },
    fallbackLng: 'en',
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ',',
    },

    react: {
        wait: true,
    },
})

export default i18n
