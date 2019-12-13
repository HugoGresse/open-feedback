import firebase from 'firebase/app'
import { formatTalksWithScheduledForHoverboardv2 } from '../../talks/talksUtils'

class Hoverboardv2Api {
    constructor(config) {
        this.config = config

        if (
            firebase.apps.filter(app => app.name === this.config.projectId)
                .length > 0
        ) {
            return
        }

        firebase.initializeApp(this.config, this.config.projectId)
    }

    getFirestore() {
        return firebase.app(this.config.projectId).firestore()
    }

    getTalks() {
        const firestore = this.getFirestore()

        const schedulePromise = firestore.collection('schedule').get()
        const talksPromise = firestore.collection('sessions').get()

        return Promise.all([schedulePromise, talksPromise]).then(
            ([resultSchedule, resultTalks]) => {
                let talks = {}
                let schedule = []
                resultTalks.forEach(doc => {
                    talks[doc.id] = {
                        ...doc.data(),
                        id: doc.id,
                    }
                })

                resultSchedule.forEach(doc => {
                    schedule.push(doc.data())
                })

                return formatTalksWithScheduledForHoverboardv2(talks, schedule)
            }
        )
    }

    getTalk(talkId) {
        const firestore = this.getFirestore()
        const schedulePromise = firestore.collection('schedule').get()
        const talksPromise = firestore
            .collection('sessions')
            .doc(talkId)
            .get()

        return Promise.all([schedulePromise, talksPromise]).then(
            ([resultSchedule, resultTalks]) => {
                let talks = {}
                let schedule = []

                talks[talkId] = {
                    ...resultTalks.data(),
                    id: resultTalks.id,
                }

                resultSchedule.forEach(doc => {
                    schedule.push(doc.data())
                })

                return formatTalksWithScheduledForHoverboardv2(talks, schedule)
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

    isReadOnly() {
        return true
    }
}

export default Hoverboardv2Api
