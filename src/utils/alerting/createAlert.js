import { functions } from '../../firebase.ts'

const createAlert = (alert) => {
    functions
        .alert(alert)
        // eslint-disable-next-line no-console
        .then((result) => console.info('Alert triggered', result))
        // eslint-disable-next-line no-console
        .catch((error) => console.warn('Alert failed', error))
}

export default createAlert
