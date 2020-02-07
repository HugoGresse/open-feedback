import delay from 'delay'

export interface AvoidTransactionCollision {
    avoidCollision(): Promise<void>
}

export const createTransactionCollisionAvoider = (): AvoidTransactionCollision => {
    let attempts = 1
    return {
        async avoidCollision() {
            attempts++
            if (attempts > 1) {
                console.log('Trying to avoid collistion')
            }
            await delay(Math.pow(2, attempts) * 1000 * Math.random())
        },
    }
}
