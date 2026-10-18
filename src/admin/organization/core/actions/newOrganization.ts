import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { trackNewOrganization } from '../../../utils/track'
import { getUserIdSelector } from '../../../auth/authSelectors'
import { getOrganizations } from './getOrganizations'
import { newRandomHexColor } from '../../../../utils/colorsUtils'

export const newOrganization =
    (name: string): AppThunk<Promise<string | undefined>> =>
    async (dispatch, getState) => {
        const userId = getUserIdSelector(getState())

        const orgData = {
            name: name,
            ownerUserId: userId,
            adminUserIds: [userId],
            editorUserIds: [userId],
            viewerUserIds: [userId],
            favicon: `${window.location.protocol}//${window.location.host}/favicon-32x32.png`,
            logoSmall: `${window.location.protocol}//${window.location.host}/android-chrome-192x192.png`,
            disableSoloTalkRedirect: false,
            hideVotesUntilUserVote: false,
            languages: [],
            chipColors: [newRandomHexColor()],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        return fireStoreMainInstance
            .collection('organizations')
            .add(orgData)
            .then(async (documentRef) => {
                dispatch(
                    addNotification({
                        type: 'success',
                        i18nkey: 'organization.newSuccess',
                    })
                )
                await dispatch(getOrganizations())
                trackNewOrganization(orgData.name)
                return documentRef.id
            })
            .catch((err: unknown) => {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.newFail',
                        message: String(err),
                    })
                )
                return undefined
            })
    }
