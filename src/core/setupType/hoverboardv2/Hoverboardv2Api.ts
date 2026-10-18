import firebase from 'firebase/compat/app'
import {
    formatTalksWithScheduledForHoverboardv2,
    type HoverboardScheduleDay,
} from '../../talks/talksUtils'
import type {
    HoverboardV2Config,
    NewTalk,
    Speaker,
    SpeakersMap,
    TalksMap,
} from '../../models'
import type { ProjectApi } from '../projectApi'

export class Hoverboardv2Api implements ProjectApi {
    config: HoverboardV2Config

    constructor(config: HoverboardV2Config) {
        this.config = config

        if (
            firebase.apps.filter((app) => app.name === this.config.projectId)
                .length > 0
        ) {
            return
        }

        firebase.initializeApp(this.config, this.config.projectId)
    }

    getFirestore() {
        return firebase.app(this.config.projectId).firestore()
    }

    getTalks(): Promise<TalksMap> {
        const firestore = this.getFirestore()

        const schedulePromise = firestore.collection('schedule').get()
        const talksPromise = firestore.collection('sessions').get()

        return Promise.all([schedulePromise, talksPromise]).then(
            ([resultSchedule, resultTalks]) => {
                const talks: TalksMap = {}
                const schedule: HoverboardScheduleDay[] = []
                resultTalks.forEach((doc) => {
                    talks[doc.id] = {
                        ...(doc.data() as NewTalk),
                        id: doc.id,
                    }
                })

                resultSchedule.forEach((doc) => {
                    schedule.push(doc.data() as HoverboardScheduleDay)
                })

                return formatTalksWithScheduledForHoverboardv2(talks, schedule)
            }
        )
    }

    getTalk(talkId: string): Promise<TalksMap> {
        const firestore = this.getFirestore()
        const schedulePromise = firestore.collection('schedule').get()
        const talksPromise = firestore.collection('sessions').doc(talkId).get()

        return Promise.all([schedulePromise, talksPromise]).then(
            ([resultSchedule, resultTalks]) => {
                const talks: TalksMap = {}
                const schedule: HoverboardScheduleDay[] = []

                talks[talkId] = {
                    ...(resultTalks.data() as NewTalk),
                    id: resultTalks.id,
                }

                resultSchedule.forEach((doc) => {
                    schedule.push(doc.data() as HoverboardScheduleDay)
                })

                return formatTalksWithScheduledForHoverboardv2(talks, schedule)
            }
        )
    }

    getSpeakers(): Promise<SpeakersMap> {
        return this.getFirestore()
            .collection('speakers')
            .get()
            .then((speakersSnapshot) => {
                const speakers: SpeakersMap = {}

                speakersSnapshot.forEach((doc) => {
                    speakers[doc.id] = doc.data() as Speaker
                    speakers[doc.id].id = doc.id
                })

                return speakers
            })
    }

    isReadOnly() {
        return true
    }
}
