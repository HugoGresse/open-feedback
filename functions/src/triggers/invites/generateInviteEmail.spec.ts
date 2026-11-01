import { describe, expect, it } from 'vitest'
import type {
    EmailInvite,
    OrganizationEmailInvite,
    ProjectEmailInvite,
} from '../../types/EmailInvite'
import { InvitationType } from '../../types/InvitationType'
import { generateInviteEmail } from './generateInviteEmail'

const render = (
    invite: EmailInvite,
    lang: 'en' | 'fr' = 'en',
    inviteId = 'i1'
) =>
    generateInviteEmail(
        invite,
        lang,
        { env: 'test', url: 'https://app.test' },
        inviteId
    )

const projectInvite = (
    overrides: Partial<ProjectEmailInvite> = {}
): ProjectEmailInvite => ({
    type: InvitationType.ProjectInvitationType,
    projectId: 'p1',
    projectName: 'DevFest',
    originUserName: 'Hugo',
    destinationUserInfo: 'guest@example.com',
    ...overrides,
})

const organizationInvite: OrganizationEmailInvite = {
    type: InvitationType.OrganizationInvitationType,
    organizationId: 'o1',
    organizationName: '<i>GDG</i>',
    originUserName: 'Hugo',
    destinationUserInfo: 'guest@example.com',
}

describe('generateInviteEmail', () => {
    it('fills the template with the invite values', () => {
        const email = render(projectInvite())

        expect(email.to).toEqual(['guest@example.com'])
        expect(email.subject).toBe(
            '[OpenFeedback] Hugo invited you to become member of the event DevFest'
        )
        expect(email.html).toContain(
            'Hey guest@example.com,<br/><br/> You have been invited to be a member of the OpenFeedback event <b>DevFest</b>.'
        )
        expect(email.html).toContain(
            'href="https://app.test/admin/?inviteId=i1"'
        )
        expect(email.html).toContain('View the event</a>')
    })

    it('escapes user values in the HTML but keeps the template markup', () => {
        const email = render(
            projectInvite({
                originUserName: '<img src=x onerror=alert(1)>',
                projectName: '"Evil" & <script>',
                destinationUserInfo: '<b>guest</b>@example.com',
            })
        )

        expect(email.html).not.toContain('<img src=x')
        expect(email.html).not.toContain('<script>')
        expect(email.html).toContain(
            '&lt;img src=x onerror=alert(1)&gt; invited you to become a member of the event "&quot;Evil&quot; &amp; &lt;script&gt;"'
        )
        expect(email.html).toContain(
            '<b>&quot;Evil&quot; &amp; &lt;script&gt;</b>'
        )
        expect(email.html).toContain(
            'Hey &lt;b&gt;guest&lt;/b&gt;@example.com,'
        )
    })

    it('encodes the invite id in the button link', () => {
        const email = render(projectInvite(), 'en', 'x"><a href="https:evil')

        expect(email.html).toContain(
            'href="https://app.test/admin/?inviteId=x%22%3E%3Ca%20href%3D%22https%3Aevil"'
        )
    })

    it('escapes the organization name', () => {
        const email = render(organizationInvite, 'fr')

        expect(email.html).toContain('<b>&lt;i&gt;GDG&lt;/i&gt;</b>')
        expect(email.subject).toBe(
            "[OpenFeedback] Hugo vous a invité à devenir membre de l'organisation <i>GDG</i>"
        )
    })

    it('keeps replacement patterns in user values literal', () => {
        const email = render(projectInvite({ projectName: "$& $' $`" }))

        expect(email.subject).toBe(
            "[OpenFeedback] Hugo invited you to become member of the event $& $' $`"
        )
        expect(email.html).toContain('<b>$&amp; $&#39; $`</b>')
    })

    it.each([
        'DevFest\r\nBcc: victim@example.com',
        'DevFest Bcc: victim@example.com',
        'DevFest\u0085\u0000Bcc: victim@example.com',
    ])('keeps the subject on one line for %j', (projectName) => {
        const email = render(projectInvite({ projectName }))

        expect(email.subject).toBe(
            '[OpenFeedback] Hugo invited you to become member of the event DevFest Bcc: victim@example.com'
        )
    })

    it.each([
        ['en', '', '[OpenFeedback] Someone invited you'],
        ['fr', null, "[OpenFeedback] Quelqu'un vous a invité"],
    ] as const)(
        'names an unknown inviter in %s',
        (lang, originUserName, subjectStart) => {
            const email = render(
                projectInvite({ originUserName: originUserName as string }),
                lang
            )

            expect(email.subject.startsWith(subjectStart)).toBe(true)
        }
    )

    it('falls back to English for an unknown lang', () => {
        const email = render(projectInvite(), 'de' as never)

        expect(email.subject).toContain('invited you')
    })
})
