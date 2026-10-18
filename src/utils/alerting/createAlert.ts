import { functions } from '../../firebase.ts'
import type { Alert } from './alerts'

export const createAlert = (alert: Alert) => {
    functions
        .alert(alert)
        // biome-ignore lint/suspicious/noConsole: intentional log
        .then((result) => console.info('Alert triggered', result))
        // biome-ignore lint/suspicious/noConsole: intentional log
        .catch((error) => console.warn('Alert failed', error))
}
