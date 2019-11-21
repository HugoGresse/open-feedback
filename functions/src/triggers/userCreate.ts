import * as functions from "firebase-functions"
import {isEmpty} from 'lodash'
import admin from "firebase-admin";
import {arrayUnion, serverTimestamp} from "../helpers/firebaseInit";

export const userCreate = functions.auth.user()
    .onCreate(async (user) => {
        if (isEmpty(user) || (isEmpty(user.email) && isEmpty(user.phoneNumber))) {
            return Promise.resolve('new anonymous user')
        }

        const userId = user.uid
        const userInfo = user.email || user.phoneNumber

        return admin
            .firestore()
            .collection('projects-invites')
            .where('destinationUserInfo', '==', userInfo)
            .where('status', '==', 'emailSent')
            .get()
            .then(querySnapshot =>  {
                const promises: Promise<any>[] = []
                querySnapshot.forEach(snapshot => {
                    const data = snapshot.data()
                    promises.push(new Promise((resolve, reject) => {
                        admin
                            .firestore()
                            .collection('projects')
                            .doc(data.projectId)
                            .update({
                                members: arrayUnion(userId),
                                updatedAt: serverTimestamp()
                            })
                            .catch((error) => {
                                return admin
                                    .firestore()
                                    .collection('projects-invites')
                                    .doc(snapshot.id)
                                    .update({
                                        updatedAt: serverTimestamp(),
                                        status: 'error',
                                        error: JSON.stringify(error)
                                    })
                            })
                            .then(() => {
                                return admin
                                    .firestore()
                                    .collection('projects-invites')
                                    .doc(snapshot.id)
                                    .update({
                                        updatedAt: serverTimestamp(),
                                        status: 'completed'
                                    })
                            })
                            .then((result) => resolve(result))
                            .catch((error) => reject(error))
                    }))
                })
                return Promise.all(promises)
            })
    })
