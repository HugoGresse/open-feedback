import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import send, { type EmailData } from './send'

const config = { key: 'key', domain: 'mg.test', api: 'https://mailgun.test' }

const email = (overrides: Partial<EmailData> = {}): EmailData => ({
    to: ['guest@example.com'],
    subject: 'Hello',
    html: '<p>Hi</p>',
    ...overrides,
})

describe('send', () => {
    const fetchMock = vi.fn()

    beforeEach(() => {
        fetchMock.mockResolvedValue(new Response('ok'))
        vi.stubGlobal('fetch', fetchMock)
        vi.spyOn(console, 'info').mockImplementation(() => undefined)
        vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
        fetchMock.mockReset()
    })

    const sentForm = (): FormData => fetchMock.mock.calls[0][1].body

    it('posts every field to Mailgun', async () => {
        await send(config, email({ replyTo: 'reply@example.com' }))

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('https://mailgun.test')
        expect(init.headers.Authorization).toBe(
            `Basic ${Buffer.from('api:key').toString('base64')}`
        )
        expect([...sentForm().entries()]).toEqual([
            ['from', 'OpenFeedback <no-reply@mg.test>'],
            ['subject', 'Hello'],
            ['html', '<p>Hi</p>'],
            ['h:Reply-To', 'reply@example.com'],
            ['to', 'guest@example.com'],
        ])
    })

    it.each([
        'a@example.com,b@example.com',
        'a@example.com\r\nBcc: b@example.com',
        '',
        undefined,
    ])('rejects the recipient %j without sending', async (address) => {
        await expect(
            send(config, email({ to: [address as string] }))
        ).rejects.toThrow('Invalid recipient email address.')
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rejects an invalid recipient after a valid one', async () => {
        await expect(
            send(config, email({ to: ['a@example.com', 'b@x.com;c@y.com'] }))
        ).rejects.toThrow('Invalid recipient email address.')
    })

    it('rejects when there are no recipients', async () => {
        await expect(send(config, email({ to: [] }))).rejects.toThrow(
            'No recipients given.'
        )
    })

    it.each(['a@example.com; b@example.com', 'me@gmail'])(
        'sends without a Reply-To when it is %j',
        async (replyTo) => {
            await send(config, email({ replyTo }))

            expect(sentForm().has('h:Reply-To')).toBe(false)
            expect(sentForm().get('to')).toBe('guest@example.com')
            expect(console.warn).toHaveBeenCalledWith(
                'Send email: invalid Reply-To dropped'
            )
        }
    )

    it('ignores an empty Reply-To', async () => {
        await send(config, email({ replyTo: '' }))

        expect(sentForm().has('h:Reply-To')).toBe(false)
        expect(console.warn).not.toHaveBeenCalled()
    })

    it('keeps the subject on one line, in the email and in the log', async () => {
        await send(
            config,
            email({
                subject: `Hi\r\nBcc: x@example.com${String.fromCodePoint(0x2028)}and\u0000more %o`,
            })
        )

        const subject = 'Hi Bcc: x@example.com and more %o'
        expect(sentForm().get('subject')).toBe(subject)
        expect(console.info).toHaveBeenCalledWith('Send email', {
            subject,
            to: ['guest@example.com'],
        })
    })
})
