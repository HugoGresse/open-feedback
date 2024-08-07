import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'
import { isLoggedSelector, isUserValidSelector } from './authSelectors'
import {
    authProvider,
    fireStoreMainInstance,
    serverTimestamp,
} from '../../firebase.ts'
import { isEmpty } from 'lodash'
import {
    trackLogin,
    trackSignIn,
    trackUserId,
} from '../../utils/analytics/track'

export const didSignIn = (baseUser, error) => {
    return async (dispatch, getState) => {
        if (isLoggedSelector(getState()) && isUserValidSelector(getState())) {
            return
        }

        if (baseUser) {
            const user = baseUser.toJSON()
            if (user.isAnonymous) {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: 'auth.errorAnonymous',
                })
            } else {
                const displayName = getDataFromProviderDataOrUser(
                    user,
                    'displayName'
                )
                const photoURL = getDataFromProviderDataOrUser(user, 'photoURL')
                const email = getDataFromProviderDataOrUser(user, 'email')
                const emailVerified = getDataFromProviderDataOrUser(
                    user,
                    'emailVerified'
                )
                const phone = getDataFromProviderDataOrUser(user, 'phoneNumber')

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        ...user,
                        displayName,
                        photoURL,
                    },
                })

                const userInDb = await getUserFromDB(user.uid)

                if (userInDb.exists) {
                    // update photoURL
                    const userDbData = userInDb.data()
                    const displayNameDb = getDataFromProviderDataOrUser(
                        userDbData,
                        'displayName'
                    )
                    const photoURLDb = getDataFromProviderDataOrUser(
                        userDbData,
                        'photoURL'
                    )
                    const emailDb = getDataFromProviderDataOrUser(
                        userDbData,
                        'email'
                    )
                    const emailVerifiedDb = userDbData.emailVerified
                    const phoneDb = getDataFromProviderDataOrUser(
                        userDbData,
                        'phoneNumber'
                    )
                    if (
                        displayNameDb !== displayName ||
                        photoURLDb !== photoURL ||
                        emailDb !== email ||
                        phoneDb !== phone ||
                        emailVerifiedDb !== emailVerified
                    ) {
                        await updateUser(
                            user,
                            displayName,
                            photoURL,
                            emailDb,
                            phone
                        )
                    }
                    trackLogin(false)
                } else {
                    await createUser(user, displayName, photoURL, phone)
                    trackSignIn(false)
                }
                trackUserId(user.uid)
            }
        } else {
            dispatch({
                type: LOGIN_ERROR,
                payload: error,
            })
        }
    }
}

export const signOut = (navigate) => (dispatch) => {
    authProvider.signOut().then(() => {
        dispatch({
            type: LOGOUT,
        })
        if (window.location.pathname === '/admin/') {
            window.location.reload()
        } else {
            navigate.replace('/admin/')
        }
    })
}

const getUserFromDB = async (uid) =>
    await fireStoreMainInstance.collection('users').doc(uid).get()

const createUser = async (user, displayName, photoURL, phone) => {
    const userField = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        displayName: displayName,
        photoURL: photoURL,
        email: user.email,
        phoneNumber: phone,
        uid: user.uid,
    }
    return fireStoreMainInstance
        .collection('users')
        .doc(user.uid)
        .set(userField)
}

const updateUser = async (user, displayName, photoURL, email, phone) => {
    const userField = {
        updatedAt: serverTimestamp(),
        displayName: displayName,
        photoURL: photoURL,
        email: email,
        emailVerified: user.emailVerified,
        phoneNumber: phone,
    }

    return fireStoreMainInstance
        .collection('users')
        .doc(user.uid)
        .update(userField)
}

export const getDataFromProviderDataOrUser = (user, keyToGet) => {
    if (!user) {
        return ''
    }
    if (user[keyToGet]) {
        return user[keyToGet]
    }
    if (isEmpty(user.providerData)) {
        return ''
    }
    const providerData = user.providerData.filter((data) => data[keyToGet])
    if (providerData.length > 0) {
        return providerData[0][keyToGet]
    }
    return ''
}
