import {LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT} from './authActionTypes'
import {isLoggedSelector} from './authSelectors'
import {authProvider, fireStoreMainInstance, serverTimestamp} from '../../firebase'
import {history} from '../../App'
import { isEmpty} from 'lodash'

export const didSignIn = (user, error) => {
    return async (dispatch, getState) => {
        if (isLoggedSelector(getState())) {
            return
        }

        if (user) {
            if (user.isAnonymous) {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: 'You cannot use the admin in anonymous mode'
                })
            } else {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                })

                const userInDb = await getUserFromDB(user.uid)

                const displayName = getDataFromProviderDataOrUser(user, 'displayName')
                const photoURL = getDataFromProviderDataOrUser(user, 'photoURL')
                const email = getDataFromProviderDataOrUser(user, 'email')
                const phone = getDataFromProviderDataOrUser(user, 'phoneNumber')

                if (userInDb.exists) {
                    // update photoURL
                    const userDbData = userInDb.data()
                    const displayNameDb = getDataFromProviderDataOrUser(userDbData, 'displayName')
                    const photoURLDb = getDataFromProviderDataOrUser(userDbData, 'photoURL')
                    const emailDb = getDataFromProviderDataOrUser(userDbData, 'email')
                    const phoneDb = getDataFromProviderDataOrUser(userDbData, 'phoneNumber')
                    if (displayNameDb !== displayName || photoURLDb !== photoURL || emailDb !== email || phoneDb !== phone) {
                        await updateUser(user, displayName, photoURL, emailDb, phone)
                    }
                } else {
                    await createUser(user, displayName, photoURL, phone)
                }
            }
        } else {
            dispatch({
                type: LOGIN_ERROR,
                payload: error
            })
        }
    }
}

export const signOut = () => dispatch => {
    authProvider.signOut().then(() => {
        dispatch({
            type: LOGOUT
        })
        history.push('/admin/')
    })
}

const getUserFromDB = async (uid) => await fireStoreMainInstance
    .collection('users')
    .doc(uid)
    .get()

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
        phoneNumber: phone
    }

    return fireStoreMainInstance
        .collection('users')
        .doc(user.uid)
        .update(userField)
}

export const getDataFromProviderDataOrUser = (user, keyToGet) => {
    if (!user) {
        return ""
    }
    if (user[keyToGet]) {
        return user[keyToGet]
    }
    if(isEmpty(user.providerData)) {
        return ""
    }
    const providerDataWithPhoto = user.providerData.filter(data => data[keyToGet])
    if (providerDataWithPhoto.length > 0) {
        return providerDataWithPhoto[0][keyToGet]
    }
    return ""
}
