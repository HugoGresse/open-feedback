import { useEffect, useRef, useState } from 'react'
// firebaseui@6 only accepts a compat Auth instance and has no maintained
// modular-compatible successor for React 18, so the compat API stays here and
// nowhere else. The compat app wraps the already-initialised modular [DEFAULT]
// app (same options), and its `.auth()` reuses the modular Auth instance,
// emulator connection included.
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { onAuthStateChanged } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { authProvider, firebaseApp } from '../firebase.ts'

// Same options: returns the compat wrapper of the modular [DEFAULT] app
const getCompatAuth = () => firebase.initializeApp(firebaseApp.options).auth()

export const StyledFirebaseAuth = ({
    uiConfig,
    className,
    uiCallback,
}: {
    uiConfig: firebaseui.auth.Config
    className?: string
    uiCallback: (widget: firebaseui.auth.AuthUI) => void
}) => {
    const [userSignedIn, setUserSignedIn] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Get or Create a firebaseUI instance.
        const firebaseUiWidget =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(getCompatAuth())
        if (uiConfig.signInFlow === 'popup') firebaseUiWidget.reset()

        // We track the auth state to reset firebaseUi if the user signs out.
        const unregisterAuthObserver = onAuthStateChanged(
            authProvider,
            (user) => {
                if (!user && userSignedIn) firebaseUiWidget.reset()
                setUserSignedIn(!!user)
            }
        )

        // Trigger the callback if any was set.
        if (uiCallback) {
            uiCallback(firebaseUiWidget)
        }

        // Render the firebaseUi Widget.
        // The div is mounted before effects run.
        firebaseUiWidget.start(elementRef.current as HTMLDivElement, uiConfig)

        return () => {
            unregisterAuthObserver()
            firebaseUiWidget.reset()
        }
    }, [firebaseui, uiConfig])

    return <div className={className} ref={elementRef} />
}
