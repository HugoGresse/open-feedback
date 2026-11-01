import { getApp, getApps, initializeApp } from 'firebase/app'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
} from 'firebase/firestore'
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
            getApps().filter((app) => app.name === this.config.projectId)
                .length > 0
        ) {
            return
        }

        initializeApp(this.config, this.config.projectId)
    }

    getFirestore() {
        return getFirestore(getApp(this.config.projectId))
    }

    getTalks(): Promise<TalksMap> {
        const firestore = this.getFirestore()

        const schedulePromise = getDocs(collection(firestore, 'schedule'))
        const talksPromise = getDocs(collection(firestore, 'sessions'))

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
        const schedulePromise = getDocs(collection(firestore, 'schedule'))
        const talksPromise = getDoc(doc(firestore, 'sessions', talkId))

        return Promise.all([schedulePromise, talksPromise]).then(
            ([resultSchedule, resultTalks]) => {
                const talks: TalksMap = {}
                const schedule: HoverboardScheduleDay[] = []

                // A session missing from the database is not a talk, even
                // when the schedule still lists it
                if (resultTalks.exists()) {
                    talks[talkId] = {
                        ...(resultTalks.data() as NewTalk),
                        id: resultTalks.id,
                    }
                }

                resultSchedule.forEach((doc) => {
                    schedule.push(doc.data() as HoverboardScheduleDay)
                })

                return formatTalksWithScheduledForHoverboardv2(talks, schedule)
            }
        )
    }

    getSpeakers(): Promise<SpeakersMap> {
        return getDocs(collection(this.getFirestore(), 'speakers')).then(
            (speakersSnapshot) => {
                const speakers: SpeakersMap = {}

                speakersSnapshot.forEach((doc) => {
                    speakers[doc.id] = doc.data() as Speaker
                    speakers[doc.id].id = doc.id
                })

                return speakers
            }
        )
    }

    isReadOnly() {
        return true
    }
}
