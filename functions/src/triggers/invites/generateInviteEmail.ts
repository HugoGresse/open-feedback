import { escape as escapeHtml } from 'lodash'
import translation from '../../i18n/langs.json'
import type { EmailData } from '../../email/send'
import userInvited from '../../email/templates/userInvited'
import type { AppEnv } from '../../types/AppEnv'
import { InvitationType } from '../../types/InvitationType'
import type { EmailInvite } from '../../types/EmailInvite'

const AVAILABLE_LANG = ['en', 'fr']
type Lang = 'en' | 'fr'

export const generateInviteEmail = (
    emailInvite: EmailInvite,
    lang: Lang,
    appEnv: AppEnv,
    inviteId: string
): EmailData => {
    const selectedLang: Lang = AVAILABLE_LANG.includes(lang) ? lang : 'en'
    const { email } = translation[selectedLang]
    const baseData = email.invites[emailInvite.type]
    const values = templateValues(emailInvite, email.unknownInviter)

    const subject = fillTemplate(baseData.subject, values, toHeaderText)
    const header = fillTemplate(baseData.header, values)
    const body = fillTemplate(baseData.body, values)
    const buttonText = fillTemplate(baseData.buttonText, values)
    // The invite id is the Firestore doc id, which the client may choose
    const buttonLink = escapeHtml(
        `${appEnv.url}/admin/?inviteId=${encodeURIComponent(inviteId)}`
    )

    return {
        to: [emailInvite.destinationUserInfo],
        subject,
        html: userInvited(header, body, buttonText, buttonLink),
    }
}

const templateValues = (
    data: EmailInvite,
    unknownInviter: string
): Record<string, string> => ({
    // Users signed in by phone have no display name
    originUserName: data.originUserName || unknownInviter,
    destinationUserInfo: data.destinationUserInfo,
    ...(data.type === InvitationType.ProjectInvitationType
        ? { projectName: data.projectName }
        : { organizationName: data.organizationName }),
})

// Invite fields are written by users: keep them on one line in the subject
const toHeaderText = (value: string): string =>
    String(value ?? '').replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, ' ')

// The templates hold HTML, so only the user values are encoded. A replacer
// function keeps `$&`-like patterns in those values literal.
const fillTemplate = (
    template: string,
    values: Record<string, string>,
    encode: (value: string) => string = escapeHtml
): string =>
    template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
        Object.hasOwn(values, key) ? encode(values[key]) : placeholder
    )
