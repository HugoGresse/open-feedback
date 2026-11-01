import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import send from '../email/send'
import { parseContactRequest, sendContactEmail } from './sendContactEmail'

vi.mock('../email/send', () => ({ default: vi.fn() }))

const sendMock = vi.mocked(send)

const callSendContactEmail = async (body: unknown) => {
    const res = {
        statusCode: 200,
        body: undefined as unknown,
        headers: {} as Record<string, string>,
        set(name: string, value: string) {
            this.headers[name] = value
            return this
        },
        status(code: number) {
            this.statusCode = code
            return this
        },
        json(payload: unknown) {
            this.body = payload
            return this
        },
    }
    await sendContactEmail(
        { method: 'POST', headers: {}, body } as never,
        res as never
    )
    return res
}

const validBody = (overrides: Record<string, unknown> = {}) =>
    JSON.stringify({
        email: 'visitor@example.com',
        message: 'Hello',
        recaptchaV3Response: 'token',
        ...overrides,
    })

describe('sendContactEmail', () => {
    const fetchMock = vi.fn()

    beforeEach(() => {
        vi.stubEnv('APP_ENV', 'test')
        vi.stubEnv('APP_URL', 'https://app.test')
        vi.stubEnv('APP_CONTACTEMAIL', 'contact@openfeedback.test')
        vi.stubEnv('APP_RECAPTCHAV3SECRET', 'captcha-secret')
        vi.stubEnv('MAILGUN_DOMAIN', 'mg.test')
        vi.stubEnv('MAILGUN_KEY', 'mg-key')
        vi.stubEnv('MAILGUN_API', 'https://mailgun.test')
        fetchMock.mockImplementation(async () =>
            Response.json({ success: true, score: 0.9 })
        )
        vi.stubGlobal('fetch', fetchMock)
        sendMock.mockResolvedValue(new Response('ok', { status: 200 }))
        vi.spyOn(console, 'info').mockImplementation(() => undefined)
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
        fetchMock.mockReset()
        sendMock.mockReset()
    })

    it('verifies the captcha, sends the email and replies success', async () => {
        const result = await callSendContactEmail(validBody())

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ success: true })
        expect(result.headers['Access-Control-Allow-Origin']).toBe('*')
        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('https://www.google.com/recaptcha/api/siteverify')
        expect(init.method).toBe('POST')
        expect(Object.fromEntries(init.body)).toEqual({
            secret: 'captcha-secret',
            response: 'token',
        })
        expect(sendMock).toHaveBeenCalledWith(
            expect.objectContaining({ domain: 'mg.test' }),
            expect.objectContaining({
                to: ['contact@openfeedback.test'],
                replyTo: 'visitor@example.com',
            })
        )
    })

    it('replies success: false with a 500 when Mailgun fails', async () => {
        sendMock.mockResolvedValue(
            new Response('invalid Reply-To', {
                status: 400,
                statusText: 'Bad Request',
            })
        )

        const result = await callSendContactEmail(validBody())

        expect(result.statusCode).toBe(500)
        expect(result.body).toEqual({
            success: false,
            error: 'Failed to send email: Bad Request',
        })
        expect(result.headers['Access-Control-Allow-Origin']).toBe('*')
        expect(console.error).toHaveBeenCalledWith(
            '> sendContactEmail Mailgun error',
            400,
            'invalid Reply-To'
        )
    })

    it('replies success: false with a 500 when Mailgun is unreachable', async () => {
        sendMock.mockRejectedValue(new TypeError('fetch failed'))

        const result = await callSendContactEmail(validBody())

        expect(result.statusCode).toBe(500)
        expect(result.body).toEqual({
            success: false,
            error: 'Failed to send email',
        })
        expect(result.headers['Access-Control-Allow-Origin']).toBe('*')
    })

    it('escapes the message and email in the HTML body', async () => {
        await callSendContactEmail(
            validBody({
                email: "o'brien@example.com",
                message: '<script>alert("x")</script>\r\nbye & thanks',
            })
        )

        const html = sendMock.mock.calls[0][1].html
        expect(html).not.toContain('<script>')
        expect(html).toContain(
            '<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;<br/>bye &amp; thanks</p>'
        )
        expect(html).toContain('From: o&#39;brien@example.com')
    })

    it('rejects invalid input with a 400 before checking the captcha', async () => {
        const result = await callSendContactEmail(
            validBody({ email: 'not-an-email' })
        )

        expect(result.statusCode).toBe(400)
        expect(result.body).toEqual({ success: false, error: 'Invalid email' })
        expect(result.headers['Access-Control-Allow-Origin']).toBe('*')
        expect(fetchMock).not.toHaveBeenCalled()
        expect(sendMock).not.toHaveBeenCalled()
    })

    it('rejects a low captcha score with a 403 without sending', async () => {
        fetchMock.mockImplementation(async () =>
            Response.json({ success: true, score: 0.1 })
        )

        const result = await callSendContactEmail(validBody())

        expect(result.statusCode).toBe(403)
        expect(result.body).toEqual({
            success: false,
            error: 'Captcha not valid',
        })
        expect(result.headers['Access-Control-Allow-Origin']).toBe('*')
        expect(sendMock).not.toHaveBeenCalled()
    })

    it('does not crash on a captcha token with a lone surrogate', async () => {
        const result = await callSendContactEmail(
            validBody({ recaptchaV3Response: '\ud800' })
        )

        expect(result.statusCode).toBe(200)
        expect(fetchMock).toHaveBeenCalledOnce()
    })
})

describe('parseContactRequest', () => {
    const fields = {
        email: 'visitor@example.com',
        message: 'Hi',
        recaptchaV3Response: 'token',
    }

    it.each([
        ['a JSON string', JSON.stringify(fields)],
        ['a Buffer', Buffer.from(JSON.stringify(fields))],
        ['an already parsed object', fields],
    ])('accepts %s', (_, body) => {
        expect(parseContactRequest(body)).toEqual(fields)
    })

    it.each([
        'first.last+tag@sub.example.co',
        "o'brien@example.com",
        'Visitor@Example.COM',
    ])('accepts the email %s', (email) => {
        expect(parseContactRequest({ ...fields, email })).toEqual({
            ...fields,
            email,
        })
    })

    it.each([
        ['{not json', 'Invalid JSON body'],
        ['42', 'Invalid body'],
        ['null', 'Invalid body'],
        [{ ...fields, email: 42 }, 'Invalid email'],
        [{ ...fields, message: '  ' }, 'Missing message'],
        [{ ...fields, message: 'a'.repeat(10001) }, 'Message too long'],
        [{ ...fields, recaptchaV3Response: undefined }, 'Missing captcha'],
    ])('rejects %j with "%s"', (body, error) => {
        expect(parseContactRequest(body)).toEqual({ error })
    })

    it.each([
        '',
        'visitor',
        'visitor@example',
        'visitor@example.com.',
        'a@b@example.com',
        'Name <visitor@example.com>',
        'a@example.com, b@example.com',
        'a@example.com\r\nBcc: b@example.com',
        'a@example.com\u0000',
        'a@exa​mple.com',
        `${'a'.repeat(250)}@example.com`,
    ])('rejects the email %j', (email) => {
        expect(parseContactRequest({ ...fields, email })).toEqual({
            error: 'Invalid email',
        })
    })
})
