import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { describe, expect, test } from 'vitest'

const require = createRequire(import.meta.url)

/** Where `dependency` resolves `pkg` from its own folder. */
const resolveFrom = (dependency: string, pkg: string) =>
    createRequire(
        `${dirname(require.resolve(`${dependency}/package.json`))}/`
    ).resolve(`${pkg}/package.json`)

// firebaseui drives the modular Auth instance (firebase/auth) through
// firebase/compat/auth. With two copies of one of these packages, the errors
// of one copy fail the other's `instanceof FirebaseError`, and every sign-in
// error shown by firebaseui becomes auth/network-request-failed (or the
// compat app wraps another Auth). npm nests a copy per dependency whenever an
// older @firebase/* package is hoisted instead.
describe('Firebase modular and compat packages', () => {
    test.each([
        '@firebase/auth',
        '@firebase/util',
        '@firebase/app',
        '@firebase/component',
    ])('share one %s', (pkg) => {
        const fromModular = resolveFrom('firebase', pkg)
        for (const compat of [
            '@firebase/auth',
            '@firebase/auth-compat',
            '@firebase/app-compat',
        ]) {
            expect(resolveFrom(compat, pkg)).toBe(fromModular)
        }
    })
})
