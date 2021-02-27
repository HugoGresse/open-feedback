import translation from '../../i18n/langs.json'
import { EmailData } from '../../email/send'
import userInvited from '../../email/templates/userInvited'
import { AppEnv } from '../../types/AppEnv'
import { InvitationType } from '../../types/InvitationType'
import { EmailInvite } from '../../types/EmailInvite'

const AVAILABLE_LANG = ['en', 'fr']
type Lang = 'en' | 'fr'

export const generateInviteEmail = (
    emailInvite: EmailInvite,
    lang: Lang,
    appEnv: AppEnv,
    inviteId: string
): EmailData => {
    const selectedLang: Lang = AVAILABLE_LANG.includes(lang) ? lang : 'en'
    const baseData = translation[selectedLang].email.invites[emailInvite.type]

    const subject = fillTemplate(baseData.subject, emailInvite)
    const header = fillTemplate(baseData.header, emailInvite)
    const body = fillTemplate(baseData.body, emailInvite)
    const buttonText = fillTemplate(baseData.buttonText, emailInvite)
    const buttonLink = `${appEnv.url}/admin/?inviteId=${inviteId}`

    return {
        to: [emailInvite.destinationUserInfo],
        subject,
        html: userInvited(header, body, buttonText, buttonLink),
    }
}

const fillTemplate = (template: string, data: EmailInvite): string => {
    const baseReplacement = template
        .replace('{originUserName}', data.originUserName)
        .replace('{destinationUserInfo}', data.destinationUserInfo)

    if (data.type === InvitationType.ProjectInvitationType) {
        return baseReplacement.replace('{projectName}', data.projectName)
    } else if (data.type === InvitationType.OrganizationInvitationType) {
        return baseReplacement.replace(
            '{organizationName}',
            data.organizationName
        )
    }
    return baseReplacement
}
