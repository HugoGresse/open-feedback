import './helpers/initFirestore'
import { db } from './helpers/updates'
import fs from 'fs'

const exportAllEventVotes = async (projectId: string) => {
    const project = (await db
        .collection('projects')
        .doc(projectId)
        .get()
        .then((doc) => doc.data())) as any

    console.log('==> Getting session data')
    const dataResponse = await fetch(project.config.jsonUrl).then((res) =>
        res.json()
    )

    const sessions: any[] = Object.keys(dataResponse.sessions).map(
        (key: string) => ({
            id: key,
            ...dataResponse.sessions[key],
        })
    )
    console.log(`Found ${sessions.length} sessions`)

    const sessionsWithSpeakersName = sessions.map((session: any) => {
        return {
            ...session,
            speakersName: session.speakers
                .map(
                    (speakerId: string) => dataResponse.speakers[speakerId].name
                )
                .join(', '),
        }
    })

    const finalExport = []

    for (const session of sessionsWithSpeakersName) {
        console.log(`Exporting session ${session.id}`)
        const sessionVotes = (await db
            .collection('projects')
            .doc(projectId)
            .collection('sessionVotes')
            .doc(session.id)
            .get()
            .then((doc) => doc.data())) as any

        finalExport.push({
            sessionId: session.id,
            title: session.title,
            speakers: session.speakers.join(', '),
            speakersName: session.speakersName,
            tags: (session.tags || []).join(', '),
            trackTitle: session.trackTitle,
            ...Object.keys(sessionVotes || {}).reduce<{
                [key: string]: string
            }>((acc, key) => {
                const voteResult = sessionVotes[key]
                const voteResultAsString =
                    typeof voteResult === 'object'
                        ? Object.values(voteResult)
                              .filter((v: any) => !!v.text)
                              .map((v: any) => v.text + ' (' + v.plus + ')')
                              .join(', ')
                              .replaceAll('\n', ' ')
                        : voteResult

                const voteQuestion = project.voteItems.find(
                    (item: { id: string; name: string }) => item.id === key
                ).name

                if (voteQuestion) {
                    acc[voteQuestion] = voteResultAsString
                }
                return acc
            }, {}),
        })
    }

    console.log(`==> Done exporting ${finalExport.length} sessions votes`)

    // Write the final export to a CSV file
    const csv = require('csv-writer').createObjectCsvWriter({
        path: './exported-event-votes.csv',
        header: [
            {
                id: 'sessionId',
                title: 'sessionId',
            },
            {
                id: 'title',
                title: 'title',
            },
            {
                id: 'speakers',
                title: 'speakers',
            },
            {
                id: 'speakersName',
                title: 'speakersName',
            },
            {
                id: 'tags',
                title: 'tags',
            },
            {
                id: 'trackTitle',
                title: 'trackTitle',
            },
            ...project.voteItems.map((item: { id: string; name: string }) => ({
                id: item.name,
                title: item.name,
            })),
        ],
        fieldDelimiter: ';',
    })
    await csv.writeRecords(finalExport)

    // write the final export to a JSON file
    fs.writeFileSync(
        './exported-event-votes.json',
        JSON.stringify(finalExport, null, 2)
    )

    console.log('==> Done writing the final export to a CSV file')
}

exportAllEventVotes('devbcn24')
