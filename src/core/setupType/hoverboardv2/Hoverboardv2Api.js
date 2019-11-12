import firebase from 'firebase/app'
import { formatSessionsWithScheduled } from '../../sessions/sessionsUtils'

class Hoverboardv2Api {
    constructor(config) {
        this.config = config

        if (
            firebase.apps.filter(app => app.name === this.config.projectId).length >
            0
        ) {
            return
        }

        firebase.initializeApp(this.config, this.config.projectId)
    }

    getFirestore() {
        return firebase
            .app(this.config.projectId)
            .firestore()
    }

    getSessions() {
        const firestore = this.getFirestore()

        const schedulePromise = firestore.collection('schedule').get()
        const sessionsPromise = firestore.collection('sessions').get()

        return Promise.all([schedulePromise, sessionsPromise]).then(
            ([resultSchedule, resultSessions]) => {
                let sessions = {}
                let schedule = []
                resultSessions.forEach(doc => {
                    sessions[doc.id] = {
                        ...doc.data(),
                        id: doc.id
                    }
                })

                resultSchedule.forEach(doc => {
                    schedule.push(doc.data())
                })

                return formatSessionsWithScheduled(sessions, schedule)
            }
        )
    }

    getSession(state, sessionId) {
        const firestore = this.getFirestore()
        const schedulePromise = firestore.collection('schedule').get()
        const sessionsPromise = firestore
            .collection('sessions')
            .doc(sessionId)
            .get()

        return Promise.all([schedulePromise, sessionsPromise]).then(
            ([resultSchedule, resultSessions]) => {
                let sessions = {}
                let schedule = []

                sessions[sessionId] = {
                    ...resultSessions.data(),
                    id: resultSessions.id
                }

                resultSchedule.forEach(doc => {
                    schedule.push(doc.data())
                })

                return formatSessionsWithScheduled(sessions, schedule)
            }
        )
    }

    getSpeakers() {
        return this.getFirestore()
            .collection('speakers')
            .get()
            .then(speakersSnapshot => {
                let speakers = {}

                speakersSnapshot.forEach(doc => {
                    speakers[doc.id] = doc.data()
                    speakers[doc.id].id = doc.id
                })

                return speakers
            })
    }
}

export default Hoverboardv2Api
