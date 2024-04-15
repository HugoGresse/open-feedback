/**
 * Change the owner user id of any matching projects to a new one.
 **/
import './helpers/initFirestore'
import { db, getAllMatchingProjects } from './helpers/updates'
import { FieldValue } from 'firebase-admin/firestore'

const main = async () => {
    console.log('==> Running change-projects-owner.ts')

    const fromUserId = ''
    const toUserId = ''

    const projects = await getAllMatchingProjects(fromUserId)

    console.log(`Found ${projects.length} projects to update`)

    for (const project of projects) {
        // @ts-ignore
        console.log(`Updating project ${project.id}`, project.name)
        await db
            .collection('projects')
            .doc(project.id)
            .update({
                owner: toUserId,
                members: FieldValue.arrayUnion(toUserId),
            })
    }

    console.log('==> Done running change-projects-owner.ts')
}

main()
