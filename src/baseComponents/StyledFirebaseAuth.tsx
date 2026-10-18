import { useEffect, useRef, useState } from 'react'
import type firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export const StyledFirebaseAuth = ({
    uiConfig,
    firebaseAuth,
    className,
    uiCallback,
}: {
    uiConfig: firebaseui.auth.Config
    firebaseAuth: firebase.auth.Auth
    className?: string
    uiCallback: (widget: firebaseui.auth.AuthUI) => void
}) => {
    const [userSignedIn, setUserSignedIn] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Get or Create a firebaseUI instance.
        const firebaseUiWidget =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(firebaseAuth)
        if (uiConfig.signInFlow === 'popup') firebaseUiWidget.reset()

        // We track the auth state to reset firebaseUi if the user signs out.
        const unregisterAuthObserver = firebaseAuth.onAuthStateChanged(
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
