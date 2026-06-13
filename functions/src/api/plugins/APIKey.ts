import crypto from 'crypto'
import { BadRequestError } from '../others/Errors'

export class APIKey {
    constructor(public readonly apiKey: string) {
        if (
            !this.apiKey.startsWith('oforg_') &&
            !this.apiKey.startsWith('ofproj_')
        ) {
            throw new BadRequestError('Invalid API key')
        }
    }

    public async areApiKeysEqual(storedKey: string): Promise<boolean> {
        const providedBuffer = Buffer.from(storedKey)
        const storedBuffer = Buffer.from(this.apiKey)

        if (providedBuffer.length !== storedBuffer.length) {
            return false
        }

        return crypto.timingSafeEqual(
            providedBuffer as Uint8Array,
            storedBuffer as Uint8Array
        )
    }

    public isOrganizationAPIKey() {
        return this.apiKey.startsWith('oforg_')
    }

    public isProjectAPIKey() {
        return this.apiKey.startsWith('ofproj_')
    }

    public static generateOrganizationApiKey(length = 48): string {
        return 'oforg_' + APIKey.generateRandomString(length)
    }

    public static generateProjectApiKey(length = 48): string {
        return 'ofproj_' + APIKey.generateRandomString(length)
    }

    private static generateRandomString(length: number): string {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += characters.charAt(crypto.randomInt(characters.length))
        }
        return result
    }
}
