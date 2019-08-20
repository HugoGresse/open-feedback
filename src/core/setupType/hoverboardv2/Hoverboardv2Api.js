import firebase from 'firebase/app'
import { formatSessionsWithScheduled } from '../../sessions/sessionsUtils'
import { getProjectConfigSelector } from '../../../feedback/project/projectSelectors'

class Hoverboardv2Api {
    constructor(project) {
        const config = project.config ? project.config : project.firebaseConfig

        if (
            firebase.apps.filter(app => app.name === config.projectId).length >
            0
        ) {
            return
        }

        firebase.initializeApp(config, config.projectId)
    }

    getFirestore = state => {
        return firebase
            .app(getProjectConfigSelector(state).projectId)
            .firestore()
    }

    getSessions(state) {
        const firestore = this.getFirestore(state)

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
        const firestore = this.getFirestore(state)
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

    getSpeakers(state) {
        return this.getFirestore(state)
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
