import { functions } from '../../firebase.ts'
import type { Alert } from './alerts'

export const createAlert = (alert: Alert) => {
    functions
        .alert(alert)
        // eslint-disable-next-line no-console
        .then((result) => console.info('Alert triggered', result))
        // eslint-disable-next-line no-console
        .catch((error) => console.warn('Alert failed', error))
}
