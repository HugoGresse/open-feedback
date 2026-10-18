export const LOGIN_SUCCESS = 'admin/login/success'
export const LOGIN_ERROR = 'admin/login/error'
export const LOGOUT = 'admin/logout'

/**
 * User fields read either on the user itself or on one of its provider data
 * entries (see getDataFromProviderDataOrUser). Shared by the serialized
 * Firebase Auth user and the Firestore `users/{uid}` document.
 */
export interface UserDataFields {
    displayName?: string | null
    photoURL?: string | null
    email?: string | null
    phoneNumber?: string | null
    emailVerified?: boolean
}

export interface UserDataSource extends UserDataFields {
    providerData?: UserDataFields[]
}

/**
 * Subset of firebase.User#toJSON() the admin relies on.
 */
export interface SerializedFirebaseUser extends UserDataSource {
    uid: string
    email: string | null
    emailVerified: boolean
    displayName: string | null
    photoURL: string | null
    phoneNumber: string | null
    isAnonymous: boolean
    providerData: UserDataFields[]
}

/**
 * The logged-in admin user stored in the auth state: the serialized Firebase
 * user with displayName and photoURL resolved from the provider data.
 */
export interface AdminUser extends SerializedFirebaseUser {
    displayName: string
    photoURL: string
}

export type LogoutAction = { type: typeof LOGOUT }

export type AuthAction =
    | { type: typeof LOGIN_SUCCESS; payload: AdminUser }
    | { type: typeof LOGIN_ERROR; payload: string | undefined }
    | LogoutAction
