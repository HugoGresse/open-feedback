export default {
    dashboard: {
        i18key: 'rooting.dashboard',
        url: '/dashboard',
    },
    talks: {
        i18key: 'rooting.talks',
        url: '/talks',
    },
    speakers: {
        i18key: 'rooting.speakers',
        url: '/speakers',
    },
    moderation: {
        i18key: 'rooting.moderation',
        url: '/moderation',
    },
    settingEvent: {
        i18key: 'rooting.settingEvent',
        url: '/setting/event',
    },
    settingVotingform: {
        i18key: 'rooting.settingVotingform',
        url: '/setting/votingform',
    },
    settingSetup: {
        i18key: 'rooting.settingSetup',
        url: '/setting/setup',
    },
    settingUsers: {
        i18key: 'rooting.settingUsers',
        url: '/setting/users',
    },
}

export const ROUTE_EVENT_SEGMENT = 'event'
export const ROUTE_ADMIN = '/admin/'
export const ROUTE_EVENT_BASE = `${ROUTE_ADMIN}${ROUTE_EVENT_SEGMENT}`

export const ROUTE_ORGANIZATION_SEGMENT = 'org'

export const ORGANIZATION_ROUTES = {
    users: {
        url: '/users',
    },
    votingForm: {
        url: '/votingForm',
    },
    theme: {
        url: '/theme',
    },
}
