// One address, no whitespace or control characters (header injection) nor
// characters that would make it a list or a display name: Mailgun reads a
// comma-separated `to` as several recipients.
const EMAIL_REGEX =
    /^[^\s\p{C}@<>(),;:"]+@[^\s\p{C}@<>(),;:"]+\.[^\s\p{C}@<>(),;:".]+$/u
const EMAIL_MAX_LENGTH = 254

export const isValidEmailAddress = (email: unknown): email is string =>
    typeof email === 'string' &&
    email.length <= EMAIL_MAX_LENGTH &&
    EMAIL_REGEX.test(email)
